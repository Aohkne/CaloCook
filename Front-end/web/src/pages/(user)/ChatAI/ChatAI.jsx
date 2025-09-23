import { useState } from 'react';

import Navbar from '@/components/ui/Navbar/Navbar';

import GeminiChat from '@/components/ui/GeminiChat/GeminiChat';
import CalobotChat from '@/components/ui/CalobotChat/CalobotChat';
// TODO: Import CalobotChat component khi tạo xong
// import CalobotChat from './CalobotChat/CalobotChat';

import styles from './ChatAI.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function ChatAI() {
  const [selectedModel, setSelectedModel] = useState('gemini');

  // Handle MODEL
  const handleModelSelect = (modelType) => {
    setSelectedModel(modelType);
  };

  return (
    <div className={cx('wrapper')}>
      <Navbar />

      {/* CHAT */}
      <div className={cx('chat-wrapper')}>
        {selectedModel === 'gemini' && <GeminiChat model={selectedModel} handleModelSelect={handleModelSelect} />}

        {selectedModel === 'calobot' && <CalobotChat model={selectedModel} handleModelSelect={handleModelSelect} />}

        {/* Placeholder cho Calobot khi chưa có component
        {selectedModel === 'calobot' && (
          <div className={cx('calobot-placeholder')}>
            <h2>Calobot Chat</h2>
            <p>Calobot component will be implemented here</p>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default ChatAI;
