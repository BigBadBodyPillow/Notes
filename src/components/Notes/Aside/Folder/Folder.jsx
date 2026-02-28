import "./Folder.css";

export function Folder({ children }) {
  return (
    <>
      <details className="folder">
        <summary>
          <span className="title">Folder</span>
        </summary>
        <ul>{children}</ul>
      </details>
    </>
  );
}
