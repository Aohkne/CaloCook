import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './DishDetail.module.scss';
import { getDishById, updateDish } from '@/api/dish';
import {
  createIngredient,
  getIngredientsByDish,
  updateIngredient,
  deactivateIngredient,
  activateIngredient
} from '@/api/ingredient';
import { getStepsByDish, createStep, updateStep, deactivateStep, activateStep } from '@/api/step';
import { Icon } from '@iconify/react';
import { getWebImagePath } from '@/utils/imageHelper';
import { getAverageRating, getRatingsByDishId } from '@/api/rating';
import { getAllCommentsForASpecificDish, deleteCommentById, createComment } from '@/api/comment';
import CommentsList from '@/components/common/Comment/Comments';

const cx = classNames.bind(styles);

function DishDetail() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [subLoading, setSubLoading] = useState(false);
  const [openCreateIngredientModal, setOpenCreateIngredientModal] = useState(false);
  const [openEditIngredientModal, setOpenEditIngredientModal] = useState(false);
  const [openEditDishModal, setOpenEditDishModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [openCreateStepModal, setOpenCreateStepModal] = useState(false);
  const [openEditStepModal, setOpenEditStepModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [stepSort, setStepSort] = useState('stepNumber');
  const [stepOrder, setStepOrder] = useState('asc');
  const [rating, setRating] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [totalComment, setTotalComment] = useState(null);

  // Add Ingredient form state
  const [ingredientFormData, setIngredientFormData] = useState({
    dishId: id,
    name: '',
    quantity: '',
    isActive: true
  });

  // Add Step form state
  const [stepFormData, setStepFormData] = useState({
    dishId: id,
    stepNumber: '',
    description: '',
    isActive: true
  });

  // Dish form state
  const [dishFormData, setDishFormData] = useState({
    name: '',
    description: '',
    cookingTime: '',
    imageUrl: '',
    calorie: '',
    difficulty: '',
    isActive: true
  });

  // Comment form state
  const [commentFormData, setCommentFormData] = useState({
    dishId: id,
    content: '',
    parentId: ''
  });

  // Reply state to show who we're replying to and to set parentId
  const [replyTo, setReplyTo] = useState(null); // { id, name }
  const commentTextareaRef = useRef(null);

  // Fetch Dish
  useEffect(() => {
    let mounted = true;
    const fetchDish = async () => {
      try {
        setLoading(true);
        const response = await getDishById(id);
        if (!mounted) return;
        setDish(response.data || null);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dish');
        setDish(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDish();

    return () => {
      mounted = false;
    };
  }, [id]);

  // Fetch Ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setSubLoading(true);
        const response = await getIngredientsByDish(id);
        setIngredients(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ingredient');
      } finally {
        setSubLoading(false);
      }
    };

    if (dish) fetchIngredients();
  }, [dish, id, stepSort, stepOrder]);

  // Fetch Steps
  useEffect(() => {
    const fetchSteps = async () => {
      try {
        setSubLoading(true);
        const response = await getStepsByDish(id);
        // Apply client-side sort so changing sort/order doesn't refetch or reload page
        setSteps(sortSteps(response.data || [], stepSort, stepOrder));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load step');
      } finally {
        setSubLoading(false);
      }
    };

    if (dish) fetchSteps();
  }, [dish, id, stepOrder, stepSort]);

  // Fetch Rating
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await getRatingsByDishId(id);
        setRating(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load rating');
      }
    };

    if (dish) fetchRating();
  }, [dish, id]);

  // Fetch Average Rating
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await getAverageRating(id);
        setAverageRatings(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load average rating');
      }
    };

    if (dish) fetchAverageRating();
  }, [dish, id]);

  // Fetch Comments for a specific dish
  useEffect(() => {
    const fetchCommentsForASpecificDish = async () => {
      try {
        const response = await getAllCommentsForASpecificDish(id);
        console.log('Comments', response.comments);
        setComments(response.comments);
        setTotalComment(response.totalComment);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load comments');
      }
    };

    if (dish) fetchCommentsForASpecificDish();
  }, [dish, id]);

  if (loading) return <div className={cx('wrapper')}>Loading...</div>;
  if (!dish) return <div className={cx('wrapper')}>No dish found</div>;

  // Handle Open Create Ingredient Modal
  const handleOpenCreateIngredientModal = () => {
    setIngredientFormData({
      dishId: id,
      name: '',
      quantity: '',
      isActive: true
    });
    setOpenCreateIngredientModal(true);
  };

  // Handle Close Create Ingredient Modal
  const handleCloseCreateIngredientModal = () => {
    setOpenCreateIngredientModal(false);
  };

  // Handle Input Change
  const handleIngredientInputChange = (e) => {
    const { id, value } = e.target;
    setIngredientFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle Ingredient Active
  const handleActiveChange = (e) => {
    setIngredientFormData((prev) => ({
      ...prev,
      isActive: e.target.checked
    }));
  };
  // Handle Dish Active
  const handleDishActiveChange = (e) => {
    setDishFormData((prev) => ({
      ...prev,
      isActive: e.target.checked
    }));
  };

  // Handle Submit Create Ingredient
  const handleSubmitCreateIngredient = async (e) => {
    e.preventDefault();
    try {
      const response = await createIngredient(ingredientFormData);
      setSuccess(response.message || 'Ingredient created successfully');

      // Fetch updated ingredients
      const updatedIngredients = await getIngredientsByDish(id);
      setIngredients(updatedIngredients.data);

      handleCloseCreateIngredientModal();
      setIngredientFormData({
        dishId: id,
        name: '',
        quantity: '',
        isActive: true
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create dish');
    }
  };

  // Handle Open Edit Ingredient Modal
  const handleOpenEditIngredientModal = (ingredient) => {
    setEditingIngredient(ingredient);
    setIngredientFormData({
      dishId: id,
      name: ingredient.name || '',
      quantity: ingredient.quantity || '',
      isActive: ingredient.isActive ?? true
    });
    setOpenEditIngredientModal(true);
  };

  // Handle Close Edit Ingredient Modal
  const handleCloseEditIngredientModal = () => {
    setOpenEditIngredientModal(false);
  };

  // Handle Submit Edit Ingredient
  const handleSubmitEditIngredient = async (e) => {
    e.preventDefault();
    try {
      if (!editingIngredient) return;

      const response = await updateIngredient(editingIngredient._id, ingredientFormData);
      setSuccess(response.message || 'Ingredient updated successfully');

      // Update the list in-place
      setIngredients((prev) =>
        prev.map((ing) => (ing._id === editingIngredient._id ? { ...ing, ...ingredientFormData } : ing))
      );

      handleCloseEditIngredientModal();
      setEditingIngredient(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update ingredient');
    }
  };

  // --- Step handlers (create / edit / toggle active) ---
  const handleOpenCreateStepModal = () => {
    setStepFormData({
      dishId: id,
      stepNumber: '',
      description: '',
      isActive: true
    });
    setOpenCreateStepModal(true);
  };

  const handleCloseCreateStepModal = () => {
    setOpenCreateStepModal(false);
  };

  const handleStepInputChange = (e) => {
    const { id, value } = e.target;
    setStepFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStepActiveChange = (e) => {
    setStepFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmitCreateStep = async (e) => {
    e.preventDefault();
    try {
      const response = await createStep(stepFormData);
      setSuccess(response.message || 'Step created successfully');

      const updated = await getStepsByDish(id);
      setSteps(sortSteps(updated.data || updated, stepSort, stepOrder));

      handleCloseCreateStepModal();
      setStepFormData({ dishId: id, stepNumber: null, description: '', isActive: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create step');
    }
  };

  const handleOpenEditStepModal = (step) => {
    setEditingStep(step);
    setStepFormData({
      dishId: id,
      stepNumber: step.stepNumber || '',
      description: step.description || '',
      isActive: step.isActive ?? true
    });
    setOpenEditStepModal(true);
  };

  const handleCloseEditStepModal = () => {
    setOpenEditStepModal(false);
  };

  const handleSubmitEditStep = async (e) => {
    e.preventDefault();
    try {
      if (!editingStep) return;
      const response = await updateStep(editingStep._id, stepFormData);
      setSuccess(response.message || 'Step updated successfully');

      setSteps((prev) =>
        sortSteps(
          prev.map((s) => (s._id === editingStep._id ? { ...s, ...stepFormData } : s)),
          stepSort,
          stepOrder
        )
      );

      handleCloseEditStepModal();
      setEditingStep(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update step');
    }
  };

  const handleDifficultyChange = (e) => {
    setDishFormData((prev) => ({
      ...prev,
      difficulty: e.target.value
    }));
  };

  // Handle Open Edit Dish Modal
  const handleOpenEditDishModal = () => {
    setDishFormData({
      name: dish.name,
      description: dish.description,
      cookingTime: dish.cookingTime,
      calorie: dish.calorie,
      imageUrl: dish.imageUrl,
      difficulty: dish.difficulty,
      isActive: dish.isActive
    });
    setOpenEditDishModal(true);
  };

  const handleDishInputChange = (e) => {
    const { id, value } = e.target;
    setDishFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCommentInputChange = (e) => {
    const { id, value } = e.target;
    setCommentFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDishFormData((prev) => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Close Edit Dish Modal
  const handleCloseEditDishModal = () => {
    setOpenEditDishModal(false);
  };

  // Handle Submit Edit Dish
  const handleSubmitEditDish = async (e) => {
    e.preventDefault();
    try {
      const response = await updateDish(id, dishFormData);
      setSuccess(response.message || 'Dish updated successfully');

      // Update local dish state
      setDish((prev) => ({
        ...prev,
        ...dishFormData
      }));

      setOpenEditDishModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update dish');
    }
  };

  // Handle Step Sort Change
  const handleStepSortChange = (e) => {
    const newSort = e.target.value;
    setStepSort(newSort);
    // sort current steps client-side
    setSteps((prev) => sortSteps(prev, newSort, stepOrder));
  };

  // Handle Step Order Change
  const handleStepOrderChange = (e) => {
    const newOrder = e.target.value;
    setStepOrder(newOrder);
    // sort current steps client-side
    setSteps((prev) => sortSteps(prev, stepSort, newOrder));
  };

  // Client-side sort helper for steps
  const sortSteps = (stepsArray = [], sortBy = 'stepNumber', order = 'asc') => {
    if (!Array.isArray(stepsArray)) return stepsArray;
    const copy = stepsArray.slice();
    copy.sort((a, b) => {
      let aval = a?.[sortBy];
      let bval = b?.[sortBy];

      // normalize for undefined/null
      if (aval === undefined || aval === null) aval = '';
      if (bval === undefined || bval === null) bval = '';

      // If sorting by stepNumber ensure numeric compare
      if (sortBy === 'stepNumber') {
        const na = Number(aval) || 0;
        const nb = Number(bval) || 0;
        return order === 'asc' ? na - nb : nb - na;
      }

      // If values are dates
      if (sortBy === 'createdAt') {
        const da = new Date(aval).getTime() || 0;
        const db = new Date(bval).getTime() || 0;
        return order === 'asc' ? da - db : db - da;
      }

      // fallback to string compare
      const sa = String(aval).toLowerCase();
      const sb = String(bval).toLowerCase();
      if (sa < sb) return order === 'asc' ? -1 : 1;
      if (sa > sb) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  };

  const handleCloseReviewDetailModal = () => {
    setSelectedReview(false);
  };

  // Delete comment handler (passes down to CommentsList)
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentById(commentId);
      setSuccess('Comment deleted successfully');
      setError('');

      // Refresh comments so UI updates immediately without a full page refresh
      try {
        const resp = await getAllCommentsForASpecificDish(id);
        setComments(resp.comments || resp.commentsList || []);
        setTotalComment(resp.totalComment ?? resp.total ?? null);
      } catch (refreshErr) {
        // If refresh fails, log but keep success message
        console.error('Failed to refresh comments after delete', refreshErr);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  // Handle Create Comment (form submit)
  const handleCreateComment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const payload = {
        dishId: commentFormData.dishId || id,
        content: commentFormData.content,
        parentId: commentFormData.parentId || ''
      };

      const response = await createComment(payload);
      setSuccess(response?.message || 'Comment created successfully');
      setError('');

      // Refresh comments for the dish
      try {
        const resp = await getAllCommentsForASpecificDish(id);
        // API in other places used resp.comments and resp.totalComment
        setComments(resp.comments || resp.commentsList || []);
        setTotalComment(resp.totalComment ?? resp.total ?? null);
      } catch (refreshErr) {
        // If refresh fails, still clear the form and show success
        console.error('Failed to refresh comments after create', refreshErr);
      }

      // Clear the comment input
      setCommentFormData({ dishId: id, content: '', parentId: '' });
      // Clear reply state (stop replying to someone)
      setReplyTo(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create comment');
    }
  };

  // Handle request to reply to a specific comment (from CommentsList)
  const handleRequestReply = (commentId, fullName) => {
    setReplyTo({ id: commentId, name: fullName });
    setCommentFormData((prev) => ({ ...prev, parentId: commentId }));
    // focus textarea
    setTimeout(() => commentTextareaRef.current?.focus(), 0);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setCommentFormData((prev) => ({ ...prev, parentId: '' }));
  };

  // Render Ingredients List
  const renderIngredients = () => {
    return (
      <div className={cx('list')}>
        {/* Create Ingredient Button */}
        <button onClick={handleOpenCreateIngredientModal} className={cx('add-ingredient-button')}>
          <Icon icon='ic:baseline-plus' width='24' height='24' />
          ADD
        </button>
        {/* Ingredient List */}
        {ingredients.length === 0 ? (
          <p className={cx('no-item-text')}>Please Add ingredients</p>
        ) : (
          <ul className={cx('ingredient-list')}>
            {ingredients.map((ingredient) => (
              <li key={ingredient._id} className={cx('ingredient-item', { banned: ingredient.isActive === false })}>
                <div className={cx('ingredient-value')}>
                  {ingredient.quantity} {ingredient.name}
                </div>
                {/* Edit Ingredient Button */}
                <div className={cx('ingredient-actions')}>
                  <button
                    className={cx('action-btn')}
                    title='Edit ingredient'
                    onClick={() => handleOpenEditIngredientModal(ingredient)}
                  >
                    <Icon icon='lucide:pen' width='24' height='24' />
                  </button>
                  <button
                    className={cx('action-btn')}
                    title={ingredient.isActive ? 'Ban ingredient' : 'Activate ingredient'}
                    onClick={async () => {
                      try {
                        if (ingredient.isActive) {
                          await deactivateIngredient(ingredient._id);
                          setIngredients((prev) =>
                            prev.map((p) => (p._id === ingredient._id ? { ...p, isActive: false } : p))
                          );
                        } else {
                          await activateIngredient(ingredient._id);
                          setIngredients((prev) =>
                            prev.map((p) => (p._id === ingredient._id ? { ...p, isActive: true } : p))
                          );
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    {/* Check Ingredient Active Status */}
                    {ingredient.isActive ? (
                      <Icon icon='mdi:ban' width='24' height='24' color='red' />
                    ) : (
                      <Icon icon='mdi:tick' width='24' height='24' color='green' />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Render Steps List
  const renderSteps = () => {
    if (subLoading) return <div className={cx('sub-loading')}>Loading...</div>;
    return (
      <div className={cx('list')}>
        <div className={cx('step-actions-container')}>
          <select
            name='Sort'
            id='sortBy'
            className={cx('sort-button')}
            onChange={handleStepSortChange}
            value={stepSort}
          >
            <option value='stepNumber'>Step Number</option>
            <option value='createdAt'>Created At</option>
          </select>
          <select
            name='Order'
            id='order'
            className={cx('order-button')}
            onChange={handleStepOrderChange}
            value={stepOrder}
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
          <button onClick={handleOpenCreateStepModal} className={cx('add-step-button')}>
            <Icon icon='ic:baseline-plus' width='24' height='24' />
            ADD
          </button>
        </div>
        {steps.length === 0 ? (
          <p className={cx('no-item-text')}>Please Add steps</p>
        ) : (
          <ol className={cx('step-list')}>
            {steps.map((s) => (
              <li key={s._id} className={cx('ingredient-item', { banned: s.isActive === false })}>
                <div className={cx('ingredient-value')}>
                  <strong className={cx('step-number')}>Step {s.stepNumber}:</strong>
                  <span className={cx('step-desc')}> {s.description}</span>
                </div>
                <div className={cx('ingredient-actions')}>
                  <button className={cx('action-btn')} title='Edit step' onClick={() => handleOpenEditStepModal(s)}>
                    <Icon icon='lucide:pen' width='24' height='24' />
                  </button>
                  <button
                    className={cx('action-btn')}
                    title={s.isActive ? 'Ban step' : 'Activate step'}
                    onClick={async () => {
                      try {
                        if (s.isActive) {
                          await deactivateStep(s._id);
                          setSteps((prev) => prev.map((p) => (p._id === s._id ? { ...p, isActive: false } : p)));
                        } else {
                          await activateStep(s._id);
                          setSteps((prev) => prev.map((p) => (p._id === s._id ? { ...p, isActive: true } : p)));
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    {s.isActive ? (
                      <Icon icon='mdi:ban' width='24' height='24' color='red' />
                    ) : (
                      <Icon icon='mdi:tick' width='24' height='24' color='green' />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  };

  return (
    <div className={cx('wrapper')}>
      {/* MSG */}
      {error && <div className={cx('error-message')}>{error}</div>}
      {success && <div className={cx('success-message')}>{success}</div>}

      {/* Back Button */}
      <div className={cx('back-button')}>
        <Link to={'/dish-management'} className={cx('back-link')}>
          <Icon icon='formkit:left' width='7' height='16' /> Back to list
        </Link>
      </div>
      {/* Main Container */}
      <div className={cx('container')}>
        {/* Dish Image */}
        <div className={cx('dish-image-container')}>
          <img className={cx('dish-image')} src={getWebImagePath(dish.imageUrl)} alt={dish.name} />
        </div>
        <div className={cx('dish-infomation')}>
          {/* Dish Name */}
          <h1 className={cx('dish-name')}>{dish.name}</h1>
          {/* Dish Description */}
          <p className={cx('dish-description')}>{dish.description}</p>
          {/* Time, Calories, Difficulty Level Cards */}
          <div className={cx('time-colories-difficulty-container')}>
            <div className={cx('card')}>
              <Icon icon='basil:clock-outline' width='24' height='24' className={cx('card-icon')} />
              <div className={cx('card-text-container')}>
                <p className={cx('card-title')}>Cooking Time</p>
                <p className={cx('card-value')}>{dish.cookingTime} Min</p>
              </div>
            </div>
            <div className={cx('card')}>
              <Icon icon='basil:fire-outline' width='24' height='24' className={cx('card-icon')} />
              <div className={cx('card-text-container')}>
                <p className={cx('card-title')}>Calories</p>
                <p className={cx('card-value')}>{dish.calorie} Kcal</p>
              </div>
            </div>
            <div className={cx('card')}>
              <Icon icon='lucide-lab:hat-chef' width='24' height='24' className={cx('card-icon')} />
              <div className={cx('card-text-container')}>
                <p className={cx('card-title')}>Difficulty Level</p>
                <p className={cx('card-value')}>{dish.difficulty}</p>
              </div>
            </div>
            {dish.isActive ? (
              <div className={cx('card')}>
                <Icon icon='heroicons-outline:status-online' width='24' height='24' className={cx('card-icon')} />
                <div className={cx('card-text-container')}>
                  <p className={cx('card-title')}>Status</p>
                  <p className={cx('card-value', 'green')}>Active</p>
                </div>
              </div>
            ) : (
              <div className={cx('card')}>
                <Icon icon='heroicons-outline:status-online' width='24' height='24' className={cx('card-icon')} />
                <div className={cx('card-text-container')}>
                  <p className={cx('card-title')}>Status</p>
                  <p className={cx('card-value', 'red')}>Blocked</p>
                </div>
              </div>
            )}

            {/* Edit Button */}
            <button className={cx('edit-button', 'span-2')} onClick={handleOpenEditDishModal}>
              <Icon icon='lucide:pen' width='24' height='24' />
              EDIT DISH
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for Ingredients / Steps */}
      <div className={cx('tabs-wrapper')}>
        <div className={cx('tabs')}>
          <button
            className={cx('tab-btn', { active: activeTab === 'ingredients' })}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
          <button className={cx('tab-btn', { active: activeTab === 'steps' })} onClick={() => setActiveTab('steps')}>
            Steps
          </button>
        </div>

        <div className={cx('tab-content')}>{activeTab === 'ingredients' ? renderIngredients() : renderSteps()}</div>
      </div>

      {/* Rating */}
      <div className={cx('rating-wrapper')}>
        <h1 className={cx('rating-title')}>Rating</h1>
        {/* Total rating */}
        <div className={cx('total-rating')}>
          <p className={cx('total-rating-average')}>{averageRatings.averageRating}</p>
          <div className='total-rating-stars'>
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              const filled = averageRatings.averageRating >= starValue;
              const halfFilled = !filled && averageRatings.averageRating >= starValue - 0.5;

              return (
                <Icon
                  key={index}
                  icon={
                    filled
                      ? 'material-symbols:star-rounded'
                      : halfFilled
                      ? 'material-symbols:star-half-rounded'
                      : 'material-symbols:star-outline-rounded'
                  }
                  width='24'
                  height='24'
                  style={{ color: filled || halfFilled ? '#EEC756' : '#D1D5DB' }}
                />
              );
            })}
            <p className={cx('total-rating-value')}>{averageRatings.totalRatings} Rating</p>
          </div>
        </div>
        {/* Reviews/Ratings List */}
        <div className={cx('reviews-container')}>
          {rating.map((review) => (
            <div key={review._id} className={cx('review-card')} onClick={() => setSelectedReview(review)}>
              {/* User Info */}
              <div className={cx('review-header')}>
                <h3 className={cx('user-name')}>{review.fullName}</h3>
                {/* Star Rating */}
                <div className={cx('review-stars')}>
                  {[...Array(5)].map((_, index) => (
                    <Icon
                      key={index}
                      icon='material-symbols:star-rounded'
                      width='20'
                      height='20'
                      style={{
                        color: index < review.star ? '#EEC756' : '#D1D5DB'
                      }}
                    />
                  ))}
                </div>
                <p className={cx('review-date')}>{new Date(review.createdAt).toISOString().split('T')[0]}</p>
              </div>

              {/* Review Description */}
              <p className={cx('review-description')}>{review.description}</p>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className={cx('comment-input-container')}>
          {replyTo && (
            <div className={cx('replying-to')}>
              Replying to <strong style={{ fontSize: 16 }}>{replyTo.name}</strong>
              <button type='button' className={cx('cancel-reply')} onClick={handleCancelReply}>
                Cancel
              </button>
            </div>
          )}

          <form className={cx('comment-form')} onSubmit={handleCreateComment}>
            <textarea
              ref={commentTextareaRef}
              id='content'
              value={commentFormData.content}
              onChange={handleCommentInputChange}
              rows={5}
              placeholder='Text...'
              className={cx('comment-form-textarea')}
            />
            <button type='submit' className={cx('comment-form-send-button')}>
              SEND
            </button>
          </form>
        </div>

        {/* Comment Section */}
        <div className={cx('comment-container')}>
          <p className={cx('comment-title')}>
            Comments <span className={cx('comment-total-value')}>{totalComment}</span>
          </p>
          <CommentsList comments={comments} onDelete={handleDeleteComment} onReply={handleRequestReply} />
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-content-top')}>
              <h3 className={cx('modal-title')}>Review Detail</h3>
              <button
                type='button'
                className={cx('modal-close-button')}
                aria-label='Close modal'
                onClick={handleCloseReviewDetailModal}
              >
                &times;
              </button>
            </div>
            <div className={cx('modal-form-review')}>
              <p className={cx('modal-form-review-fullName')}>{selectedReview.fullName}</p>
              <p className={cx('modal-form-review-date')}>
                {new Date(selectedReview.createdAt).toISOString().split('T')[0]}
              </p>
            </div>
            <div className={cx('review-stars', 'modal-form-review-star')}>
              {[...Array(5)].map((_, index) => (
                <Icon
                  key={index}
                  icon='material-symbols:star-rounded'
                  width='24'
                  height='24'
                  style={{
                    color: index < selectedReview.star ? '#EEC756' : '#999999'
                  }}
                />
              ))}
            </div>
            <div className={cx('modal-form-review-description')}>
              <p>{selectedReview.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Ingredient Modal */}
      {openCreateIngredientModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-content-top')}>
              <h3 className={cx('modal-title')}>Create Ingredient</h3>
              <button
                type='button'
                className={cx('modal-close-button')}
                aria-label='Close modal'
                onClick={handleCloseCreateIngredientModal}
              >
                &times;
              </button>
            </div>
            <form className={cx('modal-form')} onSubmit={handleSubmitCreateIngredient}>
              <div className={cx('form-group')}>
                <label htmlFor='name' className={cx('modal-input-label')}>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  value={ingredientFormData.name}
                  onChange={handleIngredientInputChange}
                  placeholder='Enter ingredient name'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label htmlFor='quantity' className={cx('modal-input-label')}>
                  Quantity
                </label>
                <input
                  id='quantity'
                  type='text'
                  value={ingredientFormData.quantity}
                  onChange={handleIngredientInputChange}
                  placeholder='Enter quantity'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group', 'activate-group')}>
                <div className={cx('activate-content')}>
                  <div>
                    <h4 className={cx('activate-title')}>Activate Ingredient</h4>
                    <p className={cx('activate-text')}>Make this ingredient available to users</p>
                  </div>
                  <label className={cx('switch')}>
                    <input
                      type='checkbox'
                      className={cx('switch-input')}
                      checked={ingredientFormData.isActive}
                      onChange={handleActiveChange}
                    />
                    <span className={cx('switch-slider')}></span>
                  </label>
                </div>
              </div>

              <div className={cx('modal-actions')}>
                <button
                  type='button'
                  className={cx('modal-button', 'modal-button-cancel')}
                  onClick={handleCloseCreateIngredientModal}
                >
                  Cancel
                </button>
                <button type='submit' className={cx('modal-button', 'modal-button-create')}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ingredient Modal */}
      {openEditIngredientModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-content-top')}>
              <h3 className={cx('modal-title')}>Edit Ingredient</h3>
              <button
                type='button'
                className={cx('modal-close-button')}
                aria-label='Close modal'
                onClick={handleCloseEditIngredientModal}
              >
                &times;
              </button>
            </div>
            <form className={cx('modal-form')} onSubmit={handleSubmitEditIngredient}>
              <div className={cx('form-group')}>
                <label htmlFor='name' className={cx('modal-input-label')}>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  value={ingredientFormData.name}
                  onChange={handleIngredientInputChange}
                  placeholder='Enter ingredient name'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label htmlFor='quantity' className={cx('modal-input-label')}>
                  Quantity
                </label>
                <input
                  id='quantity'
                  type='text'
                  value={ingredientFormData.quantity}
                  onChange={handleIngredientInputChange}
                  placeholder='Enter quantity'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group', 'activate-group')}>
                <div className={cx('activate-content')}>
                  <div>
                    <h4 className={cx('activate-title')}>Activate Ingredient</h4>
                    <p className={cx('activate-text')}>Make this ingredient available to users</p>
                  </div>
                  <label className={cx('switch')}>
                    <input
                      type='checkbox'
                      className={cx('switch-input')}
                      checked={ingredientFormData.isActive}
                      onChange={handleActiveChange}
                    />
                    <span className={cx('switch-slider')}></span>
                  </label>
                </div>
              </div>

              <div className={cx('modal-actions')}>
                <button
                  type='button'
                  className={cx('modal-button', 'modal-button-cancel')}
                  onClick={handleCloseEditIngredientModal}
                >
                  Cancel
                </button>
                <button type='submit' className={cx('modal-button', 'modal-button-create')}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Create Step Modal */}
      {openCreateStepModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-content-top')}>
              <h3 className={cx('modal-title')}>Create Step</h3>
              <button
                type='button'
                className={cx('modal-close-button')}
                aria-label='Close modal'
                onClick={handleCloseCreateStepModal}
              >
                &times;
              </button>
            </div>
            <form className={cx('modal-form')} onSubmit={handleSubmitCreateStep}>
              <div className={cx('form-group')}>
                <label htmlFor='stepNumber' className={cx('modal-input-label')}>
                  Step number
                </label>
                <input
                  id='stepNumber'
                  type='number'
                  value={stepFormData.stepNumber}
                  onChange={handleStepInputChange}
                  placeholder='Enter step number'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label htmlFor='description' className={cx('modal-input-label')}>
                  Description
                </label>
                <textarea
                  id='description'
                  value={stepFormData.description}
                  onChange={handleStepInputChange}
                  placeholder='Enter step description'
                  className={cx('modal-input', 'modal-textarea')}
                  rows={6}
                  required
                />
              </div>

              <div className={cx('form-group', 'activate-group')}>
                <div className={cx('activate-content')}>
                  <div>
                    <h4 className={cx('activate-title')}>Activate Step</h4>
                    <p className={cx('activate-text')}>Make this step available to users</p>
                  </div>
                  <label className={cx('switch')}>
                    <input
                      type='checkbox'
                      className={cx('switch-input')}
                      checked={stepFormData.isActive}
                      onChange={handleStepActiveChange}
                    />
                    <span className={cx('switch-slider')}></span>
                  </label>
                </div>
              </div>

              <div className={cx('modal-actions')}>
                <button
                  type='button'
                  className={cx('modal-button', 'modal-button-cancel')}
                  onClick={handleCloseCreateStepModal}
                >
                  Cancel
                </button>
                <button type='submit' className={cx('modal-button', 'modal-button-create')}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Step Modal */}
      {openEditStepModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-content-top')}>
              <h3 className={cx('modal-title')}>Edit Step</h3>
              <button
                type='button'
                className={cx('modal-close-button')}
                aria-label='Close modal'
                onClick={handleCloseEditStepModal}
              >
                &times;
              </button>
            </div>
            <form className={cx('modal-form')} onSubmit={handleSubmitEditStep}>
              <div className={cx('form-group')}>
                <label htmlFor='stepNumber' className={cx('modal-input-label')}>
                  Step number
                </label>
                <input
                  id='stepNumber'
                  type='number'
                  value={stepFormData.stepNumber}
                  onChange={handleStepInputChange}
                  placeholder='Enter step number'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label htmlFor='description' className={cx('modal-input-label')}>
                  Description
                </label>
                <textarea
                  id='description'
                  value={stepFormData.description}
                  onChange={handleStepInputChange}
                  placeholder='Enter step description'
                  className={cx('modal-input', 'modal-textarea')}
                  rows={6}
                  required
                />
              </div>

              <div className={cx('form-group', 'activate-group')}>
                <div className={cx('activate-content')}>
                  <div>
                    <h4 className={cx('activate-title')}>Activate Step</h4>
                    <p className={cx('activate-text')}>Make this step available to users</p>
                  </div>
                  <label className={cx('switch')}>
                    <input
                      type='checkbox'
                      className={cx('switch-input')}
                      checked={stepFormData.isActive}
                      onChange={handleStepActiveChange}
                    />
                    <span className={cx('switch-slider')}></span>
                  </label>
                </div>
              </div>

              <div className={cx('modal-actions')}>
                <button
                  type='button'
                  className={cx('modal-button', 'modal-button-cancel')}
                  onClick={handleCloseEditStepModal}
                >
                  Cancel
                </button>
                <button type='submit' className={cx('modal-button', 'modal-button-create')}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Dish Modal */}
      {openEditDishModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-content-top')}>
              <h3 className={cx('modal-title')}>Edit Dish</h3>
              <button
                type='button'
                className={cx('modal-close-button')}
                onClick={handleCloseEditDishModal}
                aria-label='Close modal'
              >
                &times;
              </button>
            </div>
            <form className={cx('modal-form')} onSubmit={handleSubmitEditDish}>
              <div className={cx('form-group')}>
                <label htmlFor='name' className={cx('modal-input-label')}>
                  Name
                </label>
                <input
                  id='name'
                  type='text'
                  value={dishFormData.name}
                  onChange={handleDishInputChange}
                  placeholder='Enter dish name'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label htmlFor='cookingTime' className={cx('modal-input-label')}>
                  Cooking Time (minutes)
                </label>
                <input
                  id='cookingTime'
                  type='number'
                  value={dishFormData.cookingTime}
                  onChange={handleDishInputChange}
                  placeholder='Enter cooking time'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group')}>
                <label htmlFor='calorie' className={cx('modal-input-label')}>
                  Calories
                </label>
                <input
                  id='calorie'
                  type='number'
                  value={dishFormData.calorie}
                  onChange={handleDishInputChange}
                  placeholder='Enter calories'
                  className={cx('modal-input')}
                  required
                />
              </div>

              <div className={cx('form-group', 'difficulty-group')}>
                <span className={cx('modal-input-label')}>Difficulty</span>
                <div className={cx('difficulty-blocks')}>
                  <label className={cx('difficulty-block')}>
                    <input
                      type='radio'
                      name='difficulty'
                      value='easy'
                      checked={dishFormData.difficulty === 'easy'}
                      onChange={handleDifficultyChange}
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Easy</span>
                  </label>
                  <label className={cx('difficulty-block')}>
                    <input
                      type='radio'
                      name='difficulty'
                      value='medium'
                      checked={dishFormData.difficulty === 'medium'}
                      onChange={handleDifficultyChange}
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Medium</span>
                  </label>
                  <label className={cx('difficulty-block')}>
                    <input
                      type='radio'
                      name='difficulty'
                      value='hard'
                      checked={dishFormData.difficulty === 'hard'}
                      onChange={handleDifficultyChange}
                      className={cx('difficulty-radio')}
                    />
                    <span className={cx('difficulty-block-text')}>Hard</span>
                  </label>
                </div>
              </div>

              <div className={cx('form-group', 'description-group')}>
                <label htmlFor='description' className={cx('modal-input-label')}>
                  Description
                </label>
                <textarea
                  id='description'
                  value={dishFormData.description}
                  onChange={handleDishInputChange}
                  placeholder='Enter dish description'
                  className={cx('modal-input', 'modal-textarea')}
                  rows={10}
                  required
                />
              </div>

              <div className={cx('form-group', 'image-group')}>
                <label className={cx('modal-input-label')}>Image</label>
                <label htmlFor='image-upload' className={cx('image-upload-area')}>
                  <input
                    type='file'
                    id='image-upload'
                    accept='image/*'
                    onChange={handleImageChange}
                    className={cx('image-upload-input')}
                  />
                  <div className={cx('image-upload-content')}>
                    {dishFormData.imageUrl ? (
                      <img src={dishFormData.imageUrl} alt='Preview' className={cx('image-preview')} />
                    ) : (
                      <>
                        <Icon icon='mdi-light:image' width='50' height='50' />
                        <span className={cx('image-upload-text')}>Click to upload</span>
                        <span className={cx('image-upload-subtext')}>No file selected</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              <div className={cx('form-group', 'activate-group')}>
                <div className={cx('activate-content')}>
                  <div>
                    <h4 className={cx('activate-title')}>Activate Dish</h4>
                    <p className={cx('activate-text')}>Make this dish available to users</p>
                  </div>
                  <label className={cx('switch')}>
                    <input
                      type='checkbox'
                      checked={dishFormData.isActive}
                      onChange={handleDishActiveChange}
                      className={cx('switch-input')}
                    />
                    <span className={cx('switch-slider')}></span>
                  </label>
                </div>
              </div>

              <div className={cx('modal-actions')}>
                <button
                  type='button'
                  className={cx('modal-button', 'modal-button-cancel')}
                  onClick={handleCloseEditDishModal}
                >
                  Cancel
                </button>
                <button type='submit' className={cx('modal-button', 'modal-button-create')}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DishDetail;
