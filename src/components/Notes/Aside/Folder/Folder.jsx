import "./Folder.css";

export function Folder({ children }) {
  return (
    <>
      <details className="folder">
        <summary>Folder</summary>
        <ul>{children}</ul>
      </details>
    </>
  );
}
