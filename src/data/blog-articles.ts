export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  author: string;
  category: string;
  readTime: number;
  seoKeywords: string;
  metaDescription: string;
}

export const blogArticles: BlogArticle[] = [
  {
    id: "1",
    slug: "best-restaurants-london-dinner-dates",
    title: "Os Melhores Restaurantes de Londres para Encontros Especiais",
    excerpt: "Descubra os restaurantes mais sofisticados e românticos de Londres, perfeitos para uma noite inesquecível com sua acompanhante de luxo.",
    metaDescription: "Guia dos melhores restaurantes de Londres para encontros especiais. Descubra locais sofisticados e românticos para uma experiência gastronômica única.",
    seoKeywords: "restaurantes Londres, jantar romântico Londres, fine dining Londres, restaurantes luxo Londres, encontros especiais Londres",
    content: `
      <h2>Experiências Gastronômicas Únicas em Londres</h2>
      
      <p>Londres oferece algumas das experiências gastronômicas mais refinadas do mundo. Para um encontro verdadeiramente especial, selecionamos os restaurantes que proporcionam não apenas uma culinária excepcional, mas também uma atmosfera perfeita para momentos íntimos.</p>

      <h3>1. Sketch - Mayfair</h3>
      <p>Um dos restaurantes mais icônicos de Londres, o Sketch combina arte contemporânea com alta gastronomia. Seu interior surrealista e menu inovador criam uma experiência gastronômica única. Perfeito para impressionar em um primeiro encontro.</p>
      
      <p><strong>Especialidade:</strong> Cozinha francesa moderna<br>
      <strong>Ambiente:</strong> Artístico e sofisticado<br>
      <strong>Preço médio:</strong> £150-200 por pessoa</p>

      <h3>2. Core by Clare Smyth - Notting Hill</h3>
      <p>Restaurante com 3 estrelas Michelin comandado pela primeira chef mulher no Reino Unido a conquistar tal distinção. A experiência gastronômica aqui é incomparável, com ingredientes britânicos de alta qualidade.</p>

      <p><strong>Especialidade:</strong> Cozinha britânica contemporânea<br>
      <strong>Ambiente:</strong> Elegante e intimista<br>
      <strong>Preço médio:</strong> £180-250 por pessoa</p>

      <h3>3. The Ritz Restaurant</h3>
      <p>Localizado no icônico hotel The Ritz, este restaurante oferece uma experiência clássica e atemporal. O dress code formal e a decoração opulenta fazem dele o local perfeito para ocasiões especiais.</p>

      <p><strong>Especialidade:</strong> Cozinha francesa clássica<br>
      <strong>Ambiente:</strong> Clássico e majestoso<br>
      <strong>Preço médio:</strong> £120-180 por pessoa</p>

      <h3>4. Aqua Shard</h3>
      <p>Situado no 31º andar do icônico The Shard, oferece vistas panorâmicas de Londres enquanto você desfruta de pratos britânicos contemporâneos. A vista noturna da cidade é simplesmente mágica.</p>

      <p><strong>Especialidade:</strong> Cozinha britânica moderna<br>
      <strong>Ambiente:</strong> Moderno com vista panorâmica<br>
      <strong>Preço médio:</strong> £100-150 por pessoa</p>

      <h3>5. Restaurant Gordon Ramsay</h3>
      <p>O primeiro restaurante do renomado chef Gordon Ramsay mantém suas 3 estrelas Michelin há mais de 20 anos. A cozinha francesa refinada e o serviço impecável garantem uma experiência inesquecível.</p>

      <p><strong>Especialidade:</strong> Cozinha francesa refinada<br>
      <strong>Ambiente:</strong> Sofisticado e profissional<br>
      <strong>Preço médio:</strong> £200-300 por pessoa</p>

      <h3>Dicas para um Encontro Perfeito</h3>
      <ul>
        <li>Reserve com antecedência - os melhores restaurantes têm lista de espera</li>
        <li>Informe sobre preferências alimentares ou alergias</li>
        <li>Considere o dress code de cada estabelecimento</li>
        <li>Solicite mesa em local mais reservado para maior privacidade</li>
        <li>Pergunte sobre menus degustação para uma experiência completa</li>
      </ul>

      <p>Cada um destes restaurantes oferece uma experiência única, perfeita para criar memórias especiais durante sua estadia em Londres.</p>
    `,
    image: "/api/placeholder/800/600",
    publishedAt: "2024-01-15",
    author: "Five London Team",
    category: "Gastronomia",
    readTime: 8
  },
  {
    id: "2",
    slug: "london-annual-events-luxury-experiences",
    title: "Eventos Anuais Exclusivos em Londres: Um Calendário de Luxo",
    excerpt: "Explore os eventos mais prestigiados de Londres ao longo do ano, desde Wimbledon até Royal Ascot, e descubra como vivê-los com estilo.",
    metaDescription: "Guia completo dos eventos anuais mais exclusivos de Londres. De Wimbledon a Royal Ascot, descubra as experiências de luxo que Londres oferece.",
    seoKeywords: "eventos Londres, Wimbledon, Royal Ascot, London Fashion Week, eventos exclusivos Londres, calendário Londres",
    content: `
      <h2>O Calendário Social de Londres</h2>
      
      <p>Londres é uma cidade que pulsa com eventos exclusivos durante todo o ano. Desde competições esportivas prestigiadas até festivais culturais únicos, a capital britânica oferece experiências incomparáveis para quem busca o melhor da vida social londrina.</p>

      <h3>Primavera: Renascimento Cultural</h3>
      
      <h4>Chelsea Flower Show (Maio)</h4>
      <p>O evento de jardinagem mais prestigiado do mundo atrai a realeza e celebridades. Esta exposição floral única oferece uma experiência sensorial incomparável em meio aos jardins mais belos criados pelos melhores paisagistas do mundo.</p>
      
      <p><strong>Quando:</strong> Terceira semana de maio<br>
      <strong>Local:</strong> Royal Hospital Chelsea<br>
      <strong>Experiência VIP:</strong> Ingressos para Preview Days com champagne reception</p>

      <h4>London Fashion Week (Setembro/Fevereiro)</h4>
      <p>Um dos eventos de moda mais importantes do mundo, onde os maiores designers apresentam suas coleções. Access exclusivo aos desfiles e after-parties fazem desta uma experiência inesquecível.</p>

      <h3>Verão: A Temporada Social</h3>
      
      <h4>Royal Ascot (Junho)</h4>
      <p>O evento de corridas de cavalos mais elegante do mundo, frequentado pela família real. O dress code rigoroso e as tradições centenárias criam uma atmosfera única de elegância e sofisticação.</p>
      
      <p><strong>Quando:</strong> Terceira semana de junho<br>
      <strong>Dress Code:</strong> Formal (cartola para homens, chapéus para mulheres)<br>
      <strong>Experiência:</strong> Royal Enclosure com acesso exclusivo</p>

      <h4>Wimbledon Championships (Junho/Julho)</h4>
      <p>O torneio de tênis mais prestigiado do mundo oferece uma experiência única combinando esporte de elite com tradições britânicas. Strawberries and cream no Centre Court são obrigatórios.</p>
      
      <p><strong>Quando:</strong> Últimas duas semanas de junho/primeira de julho<br>
      <strong>Experiência VIP:</strong> Centre Court Debenture Seats com hospitality</p>

      <h4>Henley Royal Regatta (Julho)</h4>
      <p>A regata mais elegante do mundo, onde a elite britânica se reúne às margens do Tamisa. O Stewards' Enclosure oferece a experiência mais exclusiva do evento.</p>

      <h3>Outono: Arte e Cultura</h3>
      
      <h4>Frieze Art Fair (Outubro)</h4>
      <p>Uma das feiras de arte contemporânea mais importantes do mundo, atraindo colecionadores e entusiastas da arte internacional. O evento acontece em tendas especialmente construídas no Regent's Park.</p>

      <h4>Lord Mayor's Show (Novembro)</h4>
      <p>Uma tradição de mais de 800 anos que celebra a eleição do novo Lord Mayor da City de Londres. O cortejo pelas ruas históricas da cidade é um espetáculo único.</p>

      <h3>Inverno: Elegância e Tradição</h3>
      
      <h4>Royal Opera House Season</h4>
      <p>A temporada de ópera e balé do Royal Opera House oferece performances de classe mundial em um dos teatros mais belos de Londres.</p>
      
      <p><strong>Experiência VIP:</strong> Royal Box ou Grand Tier com jantar no Amphitheatre Restaurant</p>

      <h4>New Year's Eve Fireworks</h4>
      <p>A celebração do Ano Novo em Londres é mundialmente famosa, com fogos de artifício espetaculares sobre o London Eye e o Tamisa.</p>

      <h3>Como Vivenciar Estes Eventos com Estilo</h3>
      <ul>
        <li><strong>Planejamento antecipado:</strong> Muitos eventos têm ingressos limitados que se esgotam rapidamente</li>
        <li><strong>Dress code apropriado:</strong> Cada evento tem suas próprias regras de vestimenta</li>
        <li><strong>Experiências VIP:</strong> Considere pacotes que incluem hospitalidade e acesso exclusivo</li>
        <li><strong>Acomodação de luxo:</strong> Reserve hotéis próximos aos locais dos eventos</li>
        <li><strong>Transporte privado:</strong> Evite multidões com serviços de transporte exclusivos</li>
      </ul>

      <p>Estes eventos representam o melhor da vida social londrina e oferecem oportunidades únicas para vivenciar a cultura e tradições britânicas em sua forma mais refinada.</p>
    `,
    image: "/api/placeholder/800/600",
    publishedAt: "2024-01-10",
    author: "Five London Team",
    category: "Eventos",
    readTime: 10
  },
  {
    id: "3",
    slug: "exclusive-experiences-london-luxury",
    title: "Experiências Exclusivas em Londres: Além do Turismo Convencional",
    excerpt: "Descubra experiências verdadeiramente únicas disponíveis apenas para poucos privilegiados em Londres, desde visitas privadas a locais históricos até experiências gastronômicas exclusivas.",
    metaDescription: "Guia de experiências exclusivas em Londres para visitantes sofisticados. Descubra atividades únicas e privadas além do turismo convencional.",
    seoKeywords: "experiências exclusivas Londres, turismo luxo Londres, atividades privadas Londres, Londres VIP, experiências únicas Londres",
    content: `
      <h2>Londres Além do Convencional</h2>
      
      <p>Para aqueles que buscam experiências verdadeiramente únicas, Londres oferece uma infinidade de atividades exclusivas que vão muito além dos roteiros turísticos tradicionais. Estas experiências são desenhadas para proporcionar acesso privilegiado aos tesouros mais bem guardados da cidade.</p>

      <h3>Experiências Históricas Privadas</h3>
      
      <h4>Torre de Londres - Acesso After Hours</h4>
      <p>Visite a Torre de Londres após o fechamento ao público, com acesso exclusivo às Joias da Coroa e uma experiência íntima com os Beefeaters. Esta experiência limitada oferece uma perspectiva única da história real britânica.</p>
      
      <p><strong>Duração:</strong> 3 horas<br>
      <strong>Inclui:</strong> Guia privado, champagne reception, acesso às Joias da Coroa<br>
      <strong>Capacidade:</strong> Máximo 12 pessoas</p>

      <h4>Palácio de Buckingham - State Rooms com Guia Real</h4>
      <p>Acesso privado aos State Rooms com um guia especializado em história real. Esta experiência oferece insights únicos sobre a vida da família real e a história do palácio.</p>

      <h4>Westminster Abbey - Visita Privada</h4>
      <p>Explore a abadia mais famosa da Inglaterra sem as multidões, com acesso a áreas normalmente fechadas ao público, incluindo o Chapter House e o Pyx Chamber.</p>

      <h3>Experiências Gastronômicas Exclusivas</h3>
      
      <h4>Private Dining no Sky Garden</h4>
      <p>Jantar privado no topo do "Walkie-Talkie" com vistas panorâmicas de 360° de Londres. O chef prepara um menu personalizado enquanto você desfruta das vistas mais espetaculares da cidade.</p>
      
      <p><strong>Capacidade:</strong> 2-20 pessoas<br>
      <strong>Inclui:</strong> Menu degustação personalizado, sommelier dedicado, fotógrafo profissional</p>

      <h4>Harrods Food Hall - Shopping Gastronômico Privado</h4>
      <p>Experiência de compras gastronômicas privadas na lendária Food Hall da Harrods, com personal shopper especializado e degustação de produtos exclusivos.</p>

      <h4>Borough Market - Tour Gastronômico VIP</h4>
      <p>Explore o mercado gastronômico mais famoso de Londres com acesso VIP aos fornecedores exclusivos, degustações privadas e encontros com chefs renomados.</p>

      <h3>Experiências Culturais Únnicas</h3>
      
      <h4>Royal Opera House - Backstage Experience</h4>
      <p>Acesso aos bastidores do Royal Opera House, incluindo ensaios privados, encontro com artistas e visita aos ateliês de figurinos e cenários.</p>
      
      <p><strong>Inclui:</strong> Ensaio privado, meet & greet com artistas, jantar no Amphitheatre Restaurant</p>

      <h4>Tate Modern - Curador Privado</h4>
      <p>Tour privado com curador sênior da Tate Modern, com acesso a obras normalmente em reserva técnica e discussões aprofundadas sobre arte contemporânea.</p>

      <h4>Shakespeare's Globe - Performance Privada</h4>
      <p>Assista a uma performance shakespeariana em sessão privada no histórico Globe Theatre, com atores profissionais e ambiente autêntico elizabetano.</p>

      <h3>Experiências de Luxo e Bem-estar</h3>
      
      <h4>The Ned - Spa Experience de Dia Inteiro</h4>
      <p>Experiência completa de bem-estar no spa do The Ned, incluindo tratamentos personalizados, acesso à piscina na cobertura e relaxamento nos salões privados.</p>

      <h4>Claridge's - Afternoon Tea Privado</h4>
      <p>O famoso afternoon tea do Claridge's em ambiente privado, com serviço personalizado e seleção especial de chás raros e delicacies exclusivas.</p>

      <h3>Experiências Noturnas Exclusivas</h3>
      
      <h4>London Eye - Cápsula Privada</h4>
      <p>Experiência privada no London Eye com cápsula exclusiva, champagne Bollinger e vistas noturnas espetaculares da cidade iluminada.</p>
      
      <p><strong>Duração:</strong> 30 minutos<br>
      <strong>Inclui:</strong> Champagne, chocolates Godiva, acesso prioritário</p>

      <h4>Thames - Cruise Privado</h4>
      <p>Cruise privado pelo Tamisa em yacht luxuoso, com jantar preparado por chef renomado e vista única dos marcos históricos iluminados.</p>

      <h3>Experiências Sazonais</h3>
      
      <h4>Winter Wonderland VIP (Dezembro/Janeiro)</h4>
      <p>Acesso VIP ao Winter Wonderland em Hyde Park, com fast-track para todas as atrações, chalet privado e experiência gastronômica exclusiva.</p>

      <h4>Chelsea Physic Garden - Visita Privada</h4>
      <p>Explore o jardim botânico mais antigo de Londres com o curador-chefe, aprendendo sobre plantas medicinais históricas e jardins secretos.</p>

      <h3>Como Reservar Estas Experiências</h3>
      <ul>
        <li><strong>Antecedência mínima:</strong> A maioria requer reserva com 2-4 semanas de antecedência</li>
        <li><strong>Documentação:</strong> Algumas experiências podem requerer verificação de identidade</li>
        <li><strong>Flexibilidade:</strong> Muitas experiências podem ser personalizadas conforme preferências</li>
        <li><strong>Conciergeria especializada:</strong> Utilize serviços de concierge para acesso exclusivo</li>
        <li><strong>Pacotes combinados:</strong> Muitas experiências podem ser combinadas para um dia completo</li>
      </ul>

      <p>Estas experiências representam o melhor que Londres tem a oferecer para visitantes que buscam algo verdadeiramente especial e memorável, proporcionando acesso a aspectos da cidade que poucos têm o privilégio de conhecer.</p>
    `,
    image: "/api/placeholder/800/600",
    publishedAt: "2024-01-05",
    author: "Five London Team",
    category: "Experiências",
    readTime: 12
  },
  {
    id: "4",
    slug: "luxury-hotels-london-sophisticated-stays",
    title: "Hotéis Sofisticados em Londres: Onde o Luxo Encontra a Tradição",
    excerpt: "Explore os hotéis mais luxuosos de Londres, desde clássicos atemporais até propriedades boutique modernas, perfeitos para uma estadia inesquecível.",
    metaDescription: "Guia dos hotéis mais luxuosos de Londres. Descubra acomodações sofisticadas, desde clássicos como Claridge's até boutique hotéis modernos.",
    seoKeywords: "hotéis luxo Londres, hotel sofisticado Londres, Claridge's, The Ritz London, Savoy Hotel, acomodação luxo Londres",
    content: `
      <h2>A Arte da Hospitalidade Londrina</h2>
      
      <p>Londres abriga alguns dos hotéis mais prestigiados do mundo, onde tradição centenária se encontra com luxo contemporâneo. Estas propriedades não são apenas locais para pernoitar, mas destinos em si, oferecendo experiências únicas que definem o padrão de hospitalidade de luxo.</p>

      <h3>Os Clássicos Atemporais</h3>
      
      <h4>Claridge's - Mayfair</h4>
      <p>Símbolo da elegância britânica há mais de 150 anos, o Claridge's é sinônimo de luxo discreto e serviço impecável. Frequentado pela realeza e celebridades, cada detalhe do hotel reflete sofisticação atemporal.</p>
      
      <p><strong>Características únicas:</strong><br>
      • Art Déco autêntico dos anos 1930<br>
      • Afternoon tea mundialmente famoso<br>
      • Spa AKASHA com piscina art déco<br>
      • Suítes reais com decoração personalizada<br>
      • Localização privilegiada em Mayfair</p>
      
      <p><strong>Experiência destacada:</strong> Brook Penthouse com terraço privativo e vistas panorâmicas de Londres</p>

      <h4>The Ritz London - Piccadilly</h4>
      <p>O hotel que definiu o conceito de luxo há mais de um século continua sendo referência em elegância. Sua arquitetura francesa e decoração opulenta transportam os hóspedes para uma era de glamour incomparável.</p>
      
      <p><strong>Características únicas:</strong><br>
      • Arquitetura neoclássica francesa de César Ritz<br>
      • Restaurant The Ritz com estrela Michelin<br>
      • Palm Court para afternoon tea tradicional<br>
      • Rivoli Bar com coquetéis artesanais<br>
      • Green Park view rooms</p>

      <h4>The Savoy - Covent Garden</h4>
      <p>Lenda da hospitalidade londrina, o Savoy combina tradição vitoriana com toques contemporâneos. Sua localização na Thames e história rica fazem dele uma escolha icônica.</p>
      
      <p><strong>Características únicas:</strong><br>
      • Localização na curva do Rio Tamisa<br>
      • American Bar, o bar de hotel mais famoso do mundo<br>
      • Savoy Grill de Gordon Ramsay<br>
      • Thames Foyer para afternoon tea com vista<br>
      • Suíte Royal com entrada privativa</p>

      <h3>Elegância Contemporânea</h3>
      
      <h4>The Ned - City of London</h4>
      <p>Instalado em um antigo banco dos anos 1920, The Ned redefine o conceito de hotel boutique de luxo. Seus múltiplos restaurantes e clube privado criam uma experiência social única.</p>
      
      <p><strong>Características únicas:</strong><br>
      • 9 restaurantes no mesmo local<br>
      • Ned's Club com piscina na cobertura<br>
      • Spa Cowshed com tratamentos exclusivos<br>
      • Arquitetura bancária histórica preservada<br>
      • Localização no coração financeiro</p>

      <h4>Edition London - Fitzrovia</h4>
      <p>A visão moderna de Ian Schrager para hospitalidade de luxo. Design minimalista e sofisticado combinado com tecnologia de ponta e serviço personalizado.</p>
      
      <p><strong>Características únicas:</strong><br>
      • Design de Ian Schrager<br>
      • Punch Room bar exclusivo<br>
      • Spa Edition com hamam<br>
      • Berners Tavern com teto espetacular<br>
      • Tecnologia de quarto avançada</p>

      <h3>Boutique Hotels Exclusivos</h3>
      
      <h4>The Zetter Townhouse - Marylebone</h4>
      <p>Charme georgiano autêntico em uma propriedade boutique íntima. Cada quarto é único, decorado com antiguidades e oferecendo uma experiência personalizada.</p>
      
      <p><strong>Características únicas:</strong><br>
      • Apenas 24 quartos únicos<br>
      • Seymour's Parlour cocktail bar<br>
      • Decoração com antiguidades autênticas<br>
      • Atmosfera de casa georgiana privada<br>
      • Localização discreta em Marylebone</p>

      <h4>Chiltern Firehouse - Marylebone</h4>
      <p>Ex-estação de bombeiros transformada em hotel boutique chic. Popular entre celebridades, oferece uma experiência exclusiva e contemporânea.</p>
      
      <p><strong>Características únicas:</strong><br>
      • Arquitetura vitoriana de estação de bombeiros<br>
      • Restaurante celebrity-favorite<br>
      • Bar íntimo no térreo<br>
      • Apenas 26 quartos exclusivos<br>
      • Ambiente discreto e privativo</p>

      <h3>Luxo com História</h3>
      
      <h4>Brown's Hotel - Mayfair</h4>
      <p>O primeiro hotel de Londres (1837) mantém sua elegância vitoriana enquanto oferece confortos modernos. Sua história rica inclui hóspedes como Agatha Christie e Theodore Roosevelt.</p>
      
      <p><strong>Características únicas:</strong><br>
      • Primeiro hotel de Londres<br>
      • Charlie's Bar com história centenária<br>
      • Spa ESPA exclusivo<br>
      • HIX Mayfair restaurant<br>
      • Kipling Cotta para afternoon tea</p>

      <h4>The Langham - Marylebone</h4>
      <p>Grande dame dos hotéis europeus, The Langham definiu padrões de luxo desde 1865. Sua elegância restaurada e localização privilegiada mantêm sua relevância contemporânea.</p>

      <h3>Experiências Gastronômicas de Hotel</h3>
      
      <h4>Alain Ducasse at The Dorchester</h4>
      <p>3 estrelas Michelin no coração de Mayfair, oferecendo culinária francesa contemporânea em ambiente opulento.</p>

      <h4>Fera at Claridge's</h4>
      <p>Simon Rogan traz sua filosofia farm-to-table para Mayfair, criando experiências gastronômicas únicas com ingredientes britânicos.</p>

      <h3>Spas e Bem-estar</h3>
      
      <h4>ESPA Life at Corinthia</h4>
      <p>Considerado um dos melhores spas urbanos do mundo, oferece tratamentos exclusivos em ambiente termal luxuoso.</p>

      <h4>The Spa at The Dorchester</h4>
      <p>Spa íntimo com tratamentos personalizados e produtos exclusivos, perfeito para relaxamento completo.</p>

      <h3>Dicas para Escolher o Hotel Perfeito</h3>
      <ul>
        <li><strong>Localização:</strong> Considere proximidade aos locais de interesse</li>
        <li><strong>Estilo:</strong> Clássico versus contemporâneo conforme preferência</li>
        <li><strong>Experiências:</strong> Avalie restaurantes, spas e serviços únicos</li>
        <li><strong>Reservas antecipadas:</strong> Melhores suítes requerem planejamento</li>
        <li><strong>Concierge:</strong> Utilize serviços para experiências personalizadas</li>
        <li><strong>Temporada:</strong> Considere eventos sazonais que podem afetar disponibilidade</li>
      </ul>

      <p>Cada hotel oferece uma interpretação única do luxo londrino, desde a tradição centenária até a inovação contemporânea. A escolha certa depende do estilo pessoal e das experiências desejadas durante sua estadia na capital britânica.</p>
    `,
    image: "/api/placeholder/800/600",
    publishedAt: "2023-12-28",
    author: "Five London Team",
    category: "Hospedagem",
    readTime: 15
  }
];

export const getBlogArticleBySlug = (slug: string): BlogArticle | undefined => {
  return blogArticles.find(article => article.slug === slug);
};

export const getBlogArticlesByCategory = (category: string): BlogArticle[] => {
  return blogArticles.filter(article => article.category === category);
};

export const getRelatedArticles = (currentSlug: string, limit: number = 3): BlogArticle[] => {
  return blogArticles
    .filter(article => article.slug !== currentSlug)
    .slice(0, limit);
};