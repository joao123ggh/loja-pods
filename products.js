/**
 * ====================================================================
 * BANCO DE DADOS DO CATÁLOGO DE PRODUTOS — ROLETA DOS PODS
 * ====================================================================
 * Catálogo exclusivo focado 100% em Pods Descartáveis de Alta Performance
 * ====================================================================
 */

const STORE_CONFIG = {
  storeName: "ROLETA DOS PODS",
  storeTagline: "Catálogo Oficial de Pods Descartáveis Premium",
  whatsappNumber: "5511999999999", // Altere para o seu número com DDD (ex: 5511988887777)
  whatsappDefaultMessage: "Olá! Gostaria de consultar a disponibilidade na Roleta dos Pods sobre: ",
  instagram: "@roletadospods",
  currencySymbol: "R$"
};

// Imagem e dados de destaque da categoria exclusiva de Pods
const CATEGORY_BANNERS = {
  pods: {
    title: "PODS DESCARTÁVEIS PREMIUM",
    subtitle: "Dispositivos originais de alta autonomia, telas digitais smart e os sabores mais pedidos do momento.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    badgeText: "30.000 a 40.000 Puffs",
    icon: "zap"
  }
};

const PRODUCTS_DATA = [
  // ==========================================
  // LINHA VENUM PUNCH 35K
  // ==========================================
  {
    id: "pod-venum-punch-icy-mint",
    category: "pods",
    name: "Venum Punch 35K — Icy Mint",
    brand: "Venum",
    model: "Punch 35K",
    variation: "Icy Mint",
    quantity: "35.000 Puffs",
    specs: ["35.000 Puffs", "Display Digital Smart", "Bateria Recarregável Type-C", "Nic Salt 5%"],
    price: 139.90,
    badge: "Mais Vendido",
    image: "imagens/venum-punch-35k-icy-mint.jpg",
    description: "Pod descartável Venum Punch 35.000 Puffs no refrescante sabor Icy Mint. Equipado com display digital inteligente que monitora bateria e e-líquido em tempo real, bateria recarregável Type-C e fluxo de ar ajustável para máxima satisfação mentolada."
  },
  {
    id: "pod-venum-punch-blueberry-ice",
    category: "pods",
    name: "Venum Punch 35K — Blueberry Ice",
    brand: "Venum",
    model: "Punch 35K",
    variation: "Blueberry Ice",
    quantity: "35.000 Puffs",
    specs: ["35.000 Puffs", "Display Digital Smart", "Bateria Recarregável Type-C", "Nic Salt 5%"],
    price: 139.90,
    badge: "Destaque",
    image: "imagens/venum-punch-35k-blueberry-ice.jpg",
    description: "Sabor marcante de mirtilos silvestres colhidos no ponto com um toque gelado revigorante. Entrega até 35.000 puffs com coil de malha dupla avançada e tecnologia antifuga."
  },
  {
    id: "pod-venum-punch-banana-ice",
    category: "pods",
    name: "Venum Punch 35K — Banana Ice",
    brand: "Venum",
    model: "Punch 35K",
    variation: "Banana Ice",
    quantity: "35.000 Puffs",
    specs: ["35.000 Puffs", "Display Digital Smart", "Bateria Recarregável Type-C", "Nic Salt 5%"],
    price: 139.90,
    badge: "Sensação",
    image: "imagens/venum-punch-35k-banana-ice.jpg",
    description: "Combinação adocicada e aveludada de banana madura com finalização icy super refrescante. Até 35.000 puffs com tela inteligente e alto rendimento."
  },
  {
    id: "pod-venum-punch-kiwi-passion",
    category: "pods",
    name: "Venum Punch 35K — Kiwi Passion Fruit Guava",
    brand: "Venum",
    model: "Punch 35K",
    variation: "Kiwi Passion Fruit Guava",
    quantity: "35.000 Puffs",
    specs: ["35.000 Puffs", "Display Digital Smart", "Mix Tropical Triplo", "Nic Salt 5%"],
    price: 139.90,
    badge: "Tropical",
    image: "imagens/venum-punch-35k-kiwi-passion-fruit.jpg",
    description: "A clássica e adorada combinação tropical de kiwi exótico, maracujá cítrico e goiaba doce. Vapor denso e sabor persistente durante todos os 35.000 puffs."
  },

  // ==========================================
  // LINHA ELF BAR TRIO 40K
  // ==========================================
  {
    id: "pod-elfbar-trio-sour-apple",
    category: "pods",
    name: "Elf Bar Trio 40K — Sour Apple Ice",
    brand: "Elf Bar",
    model: "Trio 40K",
    variation: "Sour Apple Ice",
    quantity: "40.000 Puffs",
    specs: ["40.000 Puffs", "Controle Triplo (Sour / Ice / Sweet)", "Smart Display LED", "Modo Turbo"],
    price: 149.90,
    badge: "Personalizável",
    image: "imagens/elfbar-trio-40k-sour-apple-ice.jpg",
    description: "Tecnologia pioneira da Elf Bar que permite calibrar a acidez (Sour), a intensidade gelada (Ice) e o dulçor (Sweet). Sabor autêntico de maçã verde ácida e gelada com incríveis 40.000 puffs e modo Turbo."
  },

  // ==========================================
  // LINHA ELF BAR ICE KING 40K
  // ==========================================
  {
    id: "pod-elfbar-ice-king-double-apple",
    category: "pods",
    name: "Elf Bar Ice King 40K — Double Apple Ice",
    brand: "Elf Bar",
    model: "Ice King 40K",
    variation: "Double Apple Ice",
    quantity: "40.000 Puffs",
    specs: ["40.000 Puffs", "5 Níveis de Controle de Gelo", "Bateria 850mAh Type-C", "Display Smart"],
    price: 144.90,
    badge: "Extra Ice",
    image: "imagens/elfbar-ice-king-40k-double-apple-ice.jpg",
    description: "Edição Ice King com inovadora regulagem em 5 níveis de frescor. Combinação equilibrada de maçã vermelha e maçã verde crocante com até 40.000 puffs de puro sabor gelado."
  },
  {
    id: "pod-elfbar-ice-king-cranberry-pineapple",
    category: "pods",
    name: "Elf Bar Ice King 40K — Cranberry Pineapple Juice",
    brand: "Elf Bar",
    model: "Ice King 40K",
    variation: "Cranberry Pineapple Juice",
    quantity: "40.000 Puffs",
    specs: ["40.000 Puffs", "5 Níveis de Controle de Gelo", "Display Smart LED", "Nic Salt 5%"],
    price: 144.90,
    badge: "Suco Gelado",
    image: "imagens/elfbar-ice-king-40k-cranberry-pineapple.jpg",
    description: "Mix suculento de cranberry com notas marcantes de abacaxi gelado. Possui seletor de 5 níveis de menthol, tela inteligente e autonomia prolongada para 40.000 puxadas."
  },

  // ==========================================
  // LINHA ELF BAR TE30K
  // ==========================================
  {
    id: "pod-elfbar-te30k-watermelon-ice",
    category: "pods",
    name: "Elf Bar TE30K — Watermelon Ice",
    brand: "Elf Bar",
    model: "TE30K Metal Card",
    variation: "Watermelon Ice",
    quantity: "30.000 Puffs",
    specs: ["30.000 Puffs", "Design Metal Card Ultrasslim", "Dual Mesh Coil", "Smart Display"],
    price: 129.90,
    badge: "Design Slim",
    image: "imagens/elfbar-te30k-watermelon-ice.jpg",
    description: "Design futurista em formato de cartão metálico (Metal Card Design). Sabor clássico e incomparável de melancia gelada com 30.000 puffs, visor digital smart e fluxo suave."
  },
  {
    id: "pod-elfbar-te30k-bubbaloo-tutti-frutti",
    category: "pods",
    name: "Elf Bar TE30K — Bubbaloo Tutti Frutti",
    brand: "Elf Bar",
    model: "TE30K Metal Card",
    variation: "Bubbaloo Tutti Frutti",
    quantity: "30.000 Puffs",
    specs: ["30.000 Puffs", "Sabor Nostálgico", "Metal Card Finish", "Display Digital"],
    price: 129.90,
    badge: "Exclusivo",
    image: "imagens/elfbar-te30k-bubbaloo-tutti-frutti.jpg",
    description: "O sabor nostálgico e irresistível do chiclete Bubbaloo Tutti-Frutti em um dispositivo ultrasslim de 30.000 puffs com acabamento metálico holográfico."
  }
];
