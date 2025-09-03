import { useState } from 'react';
import { Icon } from '@iconify/react';
import classNames from 'classnames/bind';
import styles from './FAQ.module.scss';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      question: 'What is CaloCook?',
      answer:
        'CaloCook is an app that helps you track daily calories. You can save your own recipes, view estimated calorie counts, and the app automatically resets your daily calories for easier diet management.',
      icon: <Icon icon='mdi:message-text-outline' width={20} height={20} />,
      tags: ['introduction', 'calories', 'app', 'tracking']
    },
    {
      question: 'Is CaloCook free to use?',
      answer:
        'CaloCook offers a free version with basic features. You can also upgrade to the Premium plan to unlock more advanced features.',
      icon: <Icon icon='mdi:currency-usd' width={20} height={20} />,
      tags: ['pricing', 'free', 'premium', 'upgrade']
    },
    {
      question: 'How can I add a dish and calculate calories?',
      answer:
        'Simply enter your recipe or choose from the suggested list, and the system will automatically estimate the calories and save it to your personal list.',
      icon: <Icon icon='mdi:food' width={20} height={20} />,
      tags: ['dish', 'recipe', 'calorie calculation', 'save']
    },
    {
      question: 'Does CaloCook reset my calories daily?',
      answer:
        'Yes, the app automatically resets your calorie counter each new day, making it easier to manage your daily intake.',
      icon: <Icon icon='mdi:calendar-refresh' width={20} height={20} />,
      tags: ['reset', 'daily', 'tracking', 'calories']
    },
    {
      question: 'Which devices can I use CaloCook on?',
      answer: 'CaloCook is available on both website and mobile app, so you can access it anywhere.',
      icon: <Icon icon='mdi:devices' width={20} height={20} />,
      tags: ['website', 'app', 'devices', 'support']
    },
    {
      question: 'Is my recipe and calorie data saved?',
      answer: 'Yes, all your dishes and calorie history are safely stored for future reference and management.',
      icon: <Icon icon='mdi:database' width={20} height={20} />,
      tags: ['data', 'storage', 'safe', 'history']
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value && filteredFAQ.length > 0) {
      setActiveIndex(0);
    }
  };

  return (
    <section className={cx('wrapper')}>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <h2 className={cx('title')}>FREQUENTLY ASKED QUESTIONS</h2>
          <p className={cx('subtitle')}>
            Common questions about CaloCook and how it helps you track calories effectively
          </p>
        </div>

        {/* Search Bar */}
        <div className={cx('search-container')}>
          <div className={cx('search-wrapper')}>
            <Icon icon='mdi:magnify' width={20} height={20} className={cx('search-icon')} />
            <input
              type='text'
              placeholder='Search for a question...'
              value={searchQuery}
              onChange={handleSearchChange}
              className={cx('search-input')}
            />
          </div>
        </div>

        <div className={cx('faq-list')}>
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item, index) => (
              <div key={index} className={cx('faq-item', { active: activeIndex === index })}>
                <div className={cx('faq-question')} onClick={() => toggleFAQ(index)}>
                  <div className={cx('question-content')}>
                    <div className={cx('question-icon')}>{item.icon}</div>
                    <span className={cx('question-text', 'font-anonymous')}>{item.question}</span>
                  </div>
                  <span className={cx('icon', { rotated: activeIndex === index })}>
                    {activeIndex === index ? (
                      <Icon icon='mdi:chevron-down' width={24} height={24} />
                    ) : (
                      <Icon icon='mdi:chevron-right' width={24} height={24} />
                    )}
                  </span>
                </div>

                <div className={cx('faq-answer', { expanded: activeIndex === index })}>
                  <div className={cx('answer-content')}>
                    {item.answer}
                    {item.link && (
                      <>
                        <Link
                          to={item.link.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={cx('answer-link')}
                        >
                          {item.link.text}
                        </Link>
                      </>
                    )}
                    <div className={cx('tags')}>
                      {item.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className={cx('tag')}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={cx('no-results')}>
              <Icon icon='mdi:message-text-outline' width={48} height={48} className={cx('no-results-icon')} />
              <p className={cx('no-results-text')}>No matching questions found</p>
              <p className={cx('no-results-subtitle')}>Try searching with a different keyword</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className={cx('cta-section')}>
          <div className={cx('cta-content')}>
            <h3 className={cx('cta-title')}>Still have questions?</h3>
            <p className={cx('cta-description')}>Contact us via the CaloCook fanpage to get quick support!</p>
            <Link to={'mailto:aohkne@gmail.com'} target='_blank' className={cx('cta-button')}>
              Contact Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
