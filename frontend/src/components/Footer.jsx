// components/footer.jsx
export default function Footer() {
  return (
    <footer style={{ 
      padding: "1rem", 
      textAlign: "center", 
      borderTop: "1px solid #eee",
      marginTop: "2rem"
    }}>
      © {new Date().getFullYear()} Biblioteca de Livros
    </footer>
  );
}