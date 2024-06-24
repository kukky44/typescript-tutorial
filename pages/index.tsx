import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

type Props = {
  initialImageUrl: string;
}

const IndexPage: NextPage<Props> = ({initialImageUrl}) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchImage().then(newImage => {
  //     setImageUrl(newImage.url);
  //     setLoading(false);
  //   })
  // }, []);

  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>One more cat!</button>
      <div className={styles.frame}>{loading || <img className={styles.img} src={imageUrl} />}</div>
    </div>
  )
}

export default IndexPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    }
  }
}

type Image = {
  url: string;
}

const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images: unknown = await res.json();
  if(!Array.isArray(images)) {
    throw new Error("猫の画像が取得できませんでした。");
  }

  const image: unknown = images[0];

  if(!isImage(image)) {
    throw new Error("猫の画像が取得できませんでした。");
  }
  return images[0];
}

const isImage = (value: unknown): value is Image => {
  if(!value || typeof value !== "object") {
    return false;
  }
  return "url" in value && typeof value.url === "string";
}