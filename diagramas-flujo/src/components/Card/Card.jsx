import styles from "./Card.module.css";

export default function Card({ title, children, image, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      {image && <img src={image} alt={title} className={styles.image} />}
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{children}</p>
        <button className={styles.btn}>Ver Simulación</button>
      </div>
    </div>
  );
}
