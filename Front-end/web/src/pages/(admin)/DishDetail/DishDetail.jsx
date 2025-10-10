import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { getStepsByDish } from '@/api/step';
import { Icon } from '@iconify/react';
import { getWebImagePath } from '@/utils/imageHelper';

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

  // Add Ingredient form state
  const [ingredientFormData, setIngredientFormData] = useState({
    dishId: id,
    name: '',
    quantity: '',
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

  useEffect(() => {
    // fetch ingredients and steps when dish is loaded
    const fetchSubs = async () => {
      setSubLoading(true);
      try {
        const [ingsRes, stepsRes] = await Promise.all([getIngredientsByDish(id), getStepsByDish(id)]);

        // API returns { code, message, data } commonly
        setIngredients(ingsRes?.data || ingsRes || []);
        setSteps(stepsRes?.data || stepsRes || []);
      } catch (err) {
        console.error('Failed to load ingredients/steps', err);
      } finally {
        setSubLoading(false);
      }
    };

    if (dish) fetchSubs();
  }, [dish, id]);

  if (loading) return <div className={cx('wrapper')}>Loading...</div>;
  if (error) return <div className={cx('wrapper', 'error')}>{error}</div>;
  if (!dish) return <div className={cx('wrapper')}>No dish found</div>;

  // Handle Open Create Ingredient Modal
  const handleOpenCreateIngredientModal = () => {
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

  // Render Ingredients List
  const renderIngredients = () => {
    if (subLoading) return <div className={cx('sub-loading')}>Loading...</div>;
    if (!ingredients || ingredients.length === 0) return <div className={cx('empty')}>No ingredients found</div>;
    return (
      <div className={cx('list')}>
        <h3 className={cx('list-title')}>Ingredients</h3>
        {/* Create Ingredient Button */}
        <button onClick={handleOpenCreateIngredientModal} className={cx('add-ingredient-button')}>
          <Icon icon='ic:baseline-plus' width='24' height='24' />
          Add
        </button>
        {/* Ingredient List */}
        <ul className={cx('ingredient-list')}>
          {ingredients.map((ingredient) => (
            <li key={ingredient._id} className={cx('ingredient-item', { banned: ingredient.isActive === false })}>
              <div className={cx('ingredient-value')}>
                <span className={cx('ingredient-value-tick')}>•</span> {ingredient.quantity} {ingredient.name}
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
      </div>
    );
  };

  // Render Steps List
  const renderSteps = () => {
    if (subLoading) return <div className={cx('sub-loading')}>Loading...</div>;
    if (!steps || steps.length === 0) return <div className={cx('empty')}>No steps found</div>;
    const sorted = [...steps].sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));
    return (
      <ol className={cx('step-list')}>
        {sorted.map((s) => (
          <li key={s._id} className={cx('step-item')}>
            <div className={cx('step-number')}>Step {s.stepNumber}</div>
            <div className={cx('step-desc')}>{s.description}</div>
          </li>
        ))}
      </ol>
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
              Edit Dish
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
      {/* Edit Dish Modal */}
      {openEditDishModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-content-top')}>
              <h3 className={cx('modal-title')}>Create Dish</h3>
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
