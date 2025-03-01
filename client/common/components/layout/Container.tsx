"use client";

interface IProps {
  children: React.ReactNode;
}

export const Container: React.FC<IProps> = ({ children }) => {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: "0 15px",
        maxWidth: "1140px",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};
