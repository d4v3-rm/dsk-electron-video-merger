import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import codecGuideMarkdown from '@renderer/content/codec-guide.en.md?raw';

const { Paragraph, Text, Title } = Typography;

export const CodecGuideModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={t('composer.tooltips.codecGuide')}>
        <Button
          aria-label={t('composer.tooltips.codecGuide')}
          icon={<QuestionCircleOutlined />}
          onClick={() => setOpen(true)}
          size="small"
          type="text"
        />
      </Tooltip>

      <Modal
        centered
        destroyOnHidden
        footer={null}
        onCancel={() => setOpen(false)}
        open={open}
        title={t('codecGuide.title')}
        width={760}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <Title level={3}>{children}</Title>,
            h2: ({ children }) => <Title level={4}>{children}</Title>,
            h3: ({ children }) => <Title level={5}>{children}</Title>,
            p: ({ children }) => <Paragraph>{children}</Paragraph>,
            li: ({ children }) => (
              <li style={{ marginBottom: 8 }}>
                <Text>{children}</Text>
              </li>
            ),
            ul: ({ children }) => <ul style={{ paddingInlineStart: 20, marginBottom: 16 }}>{children}</ul>,
            strong: ({ children }) => <Text strong>{children}</Text>,
            code: ({ children }) => <Text code>{children}</Text>,
          }}
        >
          {codecGuideMarkdown}
        </ReactMarkdown>
      </Modal>
    </>
  );
};
