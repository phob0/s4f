import Image, { ImageProps } from "next/image";

const NextImage = ({ ...props }: ImageProps) => {
  // eslint-disable-next-line jsx-a11y/alt-text
  return (
    <Image
      alt=""
      {...props}
      style={{
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
};

export default NextImage;
