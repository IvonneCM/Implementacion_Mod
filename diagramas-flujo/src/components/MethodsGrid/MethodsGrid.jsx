import Card from "../Card/Card";
import styles from "./MethodsGrid.module.css";
import { useNavigate } from "react-router-dom";

// ✅ Importa las imágenes directamente
import azucarImg from "../../assets/images/azucar.jpg";
import gallinaImg from "../../assets/images/gallina.jpg";
import clientesImg from "../../assets/images/clientes.jpg";
import dadosImg from "../../assets/images/dados.jpg";

const items = [
  {
    id: "azucar",
    title: "Agencia de Azúcar",
    text: "Simulación del inventario de azúcar considerando demanda, costo y lead time.",
    image: azucarImg, // ✅ Usamos la variable importada
    link: "/azucar"
  },
  {
    id: "gallina",
    title: "Producción de Huevos",
    text: "Modelo de simulación para la producción diaria de huevos de gallinas.",
    image: gallinaImg,
    link: "/huevos"
  },
  {
    id: "clientes",
    title: "Llegada de Clientes a una Tienda",
    text: "Simulación de llegadas de clientes según una distribución uniforme y su atención.",
    image: clientesImg,
    link: "/tienda"
  },
  {
    id: "dados",
    title: "Lanzamiento de Dados",
    text: "Simulación de múltiples lanzamientos de dados para observar su distribución de frecuencias.",
    image: dadosImg,
    link: "/dados"
  }
];

export default function MethodsGrid() {
  const navigate = useNavigate();

  return (
    <section className="container" id="inicio" aria-label="Simulaciones">
      <h1 className={styles.sectionTitle}>Simulaciones Implementadas</h1>
      <p className={styles.sectionSubtitle}>
        Explora los distintos problemas de simulación desarrollados: inventario, producción,
        atención al cliente y juegos de azar.
      </p>

      <div className={styles.grid}>
        {items.map((it) => (
          <Card
            key={it.id}
            title={it.title}
            image={it.image}
            onClick={() => navigate(it.link)}
          >
            {it.text}
          </Card>
        ))}
      </div>
    </section>
  );
}
