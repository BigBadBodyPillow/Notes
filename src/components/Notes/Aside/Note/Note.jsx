//css
import "./Note.css";

export function Note({ image, title }) {
  return (
    <>
      <li className="note">
        <img src={image} alt="" />
        <p>{title}</p>
      </li>
    </>
  );
}
