export type TLocationModalProps = {
  visible: boolean;
  onConfirm: (cep: string) => void;
  onClose: () => void;
};
