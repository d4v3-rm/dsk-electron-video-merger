import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useShallow } from 'zustand/react/shallow';
import codecGuideMarkdown from '@renderer/content/codec-guide.en.md?raw';
import { selectCodecGuideModalState } from '@renderer/store/ui-store.selectors';
import { useUiStore } from '@renderer/store/use-ui-store';
import {
  APP_MODAL_BODY_STYLE,
  APP_MODAL_TOP_OFFSET,
  APP_MODAL_WIDTH,
} from '@renderer/utils/modal-presentation';
import {
  modalBodyInsetStyle,
  modalContentStyle,
  modalHeaderStyle,
  tableCellStyle,
  tableHeaderCellStyle,
  tableStyle,
} from '@renderer/theme/component-styles';

const { Paragraph, Text, Title } = Typography;

export const CodecGuideModal = () => {
  const { t } = useTranslation();
  const { codecGuideModalOpen, setCodecGuideModalOpen } = useUiStore(useShallow(selectCodecGuideModalState));

  return (
    <>
      <Tooltip title={t('composer.tooltips.codecGuide')}>
        <Button
          aria-label={t('composer.tooltips.codecGuide')}
          icon={<QuestionCircleOutlined />}
          onClick={() => setCodecGuideModalOpen(true)}
          size="small"
          type="text"
        />
      </Tooltip>

      <Modal
        destroyOnHidden
        footer={null}
        onCancel={() => setCodecGuideModalOpen(false)}
        open={codecGuideModalOpen}
        style={{ top: APP_MODAL_TOP_OFFSET }}
        styles={{
          body: { ...APP_MODAL_BODY_STYLE, ...modalBodyInsetStyle },
          content: modalContentStyle,
          header: modalHeaderStyle,
        }}
        title={t('codecGuide.title')}
        width={APP_MODAL_WIDTH}
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
            table: ({ children }) => <table style={tableStyle}>{children}</table>,
            th: ({ children }) => <th style={tableHeaderCellStyle}>{children}</th>,
            td: ({ children }) => <td style={tableCellStyle}>{children}</td>,
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
