import { CSSProperties, Dispatch, SetStateAction, useEffect } from "react";
import styles from "./Alert.module.css";
import { CircleCheck, CircleX, Info, TriangleAlert } from "lucide-react";

export enum AlertTypes {
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

type AlertDataProps = {
  isVisible: boolean;
  type: AlertTypes;
  body: string;
  title?: string;
  handleVisibility: Dispatch<SetStateAction<boolean>>;
  handleOnClose?: () => void;
};

export const Alert = ({
  isVisible,
  body,
  title,
  type,
  handleVisibility,
  handleOnClose,
}: AlertDataProps) => {
  const getAlertStyle = (): CSSProperties => {
    switch (type) {
      case AlertTypes.ERROR:
        return { backgroundColor: "oklch(39.6% 0.141 25.723)", color: "#fff" };
      case AlertTypes.SUCCESS:
        return { backgroundColor: "oklch(39.3% 0.095 152.535)", color: "#fff" };
      case AlertTypes.WARNING:
        return { backgroundColor: "oklch(79.5% 0.184 86.047)", color: "#fff" };
      default:
        return { backgroundColor: "oklch(39.8% 0.195 277.366)", color: "#fff" };
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case AlertTypes.ERROR:
        return <CircleX size={18} />;
      case AlertTypes.SUCCESS:
        return <CircleCheck size={18} />;
      case AlertTypes.WARNING:
        return <TriangleAlert size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        handleVisibility(false);
        if (handleOnClose) {
          handleOnClose();
        }
      }, 3000);
    }
  });
  if (!isVisible) return;
  return (
    <div
      role="alert"
      className={`${styles.alert} ${isVisible ? styles.show : styles.hide}`}
      style={getAlertStyle()}
    >
      <div className="flex flex-row items-start gap-3">
        {getAlertIcon()}
        <div className="flex justify-flex-start gap-y-2">
          {title && <p className="text-lg">{title}</p>}
          <strong className="block flex-1 leading-tight font-semibold">
            {body}
          </strong>
        </div>
      </div>
    </div>
  );
};
