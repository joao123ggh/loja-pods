# 🎲 Catálogo ROLETA DOS PODS — Pods Descartáveis Premium

Site profissional, moderno e futurista exclusivo para **Pods Descartáveis de Alta Autonomia** (30K a 40K Puffs).

Linhas em destaque:
1. **Venum Punch 35K** (Icy Mint, Blueberry Ice, Banana Ice, Kiwi Passion Fruit Guava)
2. **Elf Bar Trio 40K** (Sour Apple Ice)
3. **Elf Bar Ice King 40K** (Double Apple Ice, Cranberry Pineapple Juice)
4. **Elf Bar TE30K Metal Card** (Watermelon Ice, Bubbaloo Tutti Frutti)

---

## 🚀 Como Abrir e Usar o Catálogo

Você pode abrir o site de duas formas simples:
- **Opção 1:** Dê dois cliques no arquivo **`ABRIR_CATALOGO.bat`**
- **Opção 2:** Dê dois cliques diretamente no arquivo **`index.html`**

O catálogo abrirá instantaneamente em qualquer navegador (Chrome, Edge, Opera, Firefox, Safari) sem precisar instalar nenhum programa adicional!

---

## 🛍️ Novas Funcionalidades Incluídas

1. **Sacola de Pedidos no WhatsApp (Carrinho Inteligente):**
   - O cliente pode navegar e clicar em **"+ Sacola"** em vários produtos diferentes.
   - A sacola lateral calcula o valor total estimado e as quantidades.
   - Ao clicar em **"Finalizar Pedido no WhatsApp"**, o site envia a lista completa formatada com todos os produtos escolhidos diretamente para você!

2. **Filtro por Categoria e Marcas:**
   - Filtro instantâneo por categoria (Todas, Pods, Vapes, Cigarros).
   - Seletor suspenso de **Marcas** (Ignite, Elf Bar, Vaporesso, Geekvape, Marlboro, Camel, etc.).
   - Campo de **pesquisa em tempo real** por nome, sabor ou especificações.

3. **Painel do Administrador (Cadastrar Produtos pela Tela):**
   - No cabeçalho ou rodapé, clique em **"Painel"**.
   - Preencha os campos do produto (Nome, Categoria, Marca, Preço, Sabor, Foto, etc.).
   - Clique em **"Salvar Produto"**: ele aparece imediatamente no catálogo!
   - Clique em **"Baixar products.js Atualizado"** para salvar as alterações definitivamente no seu arquivo.

4. **Resiliência a Imagens (Fallback SVG):**
   - Se uma imagem da internet falhar ou se você estiver sem conexão, o site exibe automaticamente uma arte vetorial com o nome do produto e o ícone da categoria. Nunca fica com imagem quebrada!

5. **Verificação de Idade (+18):**
   - Modal em conformidade legal que bloqueia o acesso inicial até a confirmação de maioridade.

---

## 📱 Como Alterar o Número do WhatsApp e Nome da Loja

Abra o arquivo [`products.js`](file:///c:/Users/pauli/Documents/loja%201/products.js) no Bloco de Notas ou editor de sua preferência:

```javascript
const STORE_CONFIG = {
  storeName: "LUMEN CO.",
  whatsappNumber: "5511999999999", // Coloque seu DDD e telefone aqui (somente números)
  // ...
};
```

---

## 📁 Estrutura dos Arquivos

- **[`index.html`](file:///c:/Users/pauli/Documents/loja%201/index.html)**: Estrutura da página, modais e seções.
- **[`products.js`](file:///c:/Users/pauli/Documents/loja%201/products.js)**: Banco de dados com os 18 produtos de exemplo.
- **[`app.js`](file:///c:/Users/pauli/Documents/loja%201/app.js)**: Lógica da sacola, busca, filtros e WhatsApp.
- **[`styles.css`](file:///c:/Users/pauli/Documents/loja%201/styles.css)**: Estilos refinados, animações e tema dark luxury.
- **[`ABRIR_CATALOGO.bat`](file:///c:/Users/pauli/Documents/loja%201/ABRIR_CATALOGO.bat)**: Atalho para abrir com 1 clique no Windows.
