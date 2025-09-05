-- Inserir posts de exemplo para testar a funcionalidade de gerenciamento
INSERT INTO public.blog_posts (
  title, 
  slug, 
  excerpt, 
  content, 
  author, 
  category, 
  image, 
  meta_description, 
  seo_keywords, 
  service_keywords, 
  is_published, 
  read_time
) VALUES 
(
  'Guia Completo para Eventos Corporativos de Luxo',
  'guia-eventos-corporativos-luxo',
  'Descubra como organizar eventos corporativos memoráveis com nossa expertise em acompanhamento executivo.',
  'Eventos corporativos de alto nível requerem atenção aos detalhes e a presença de acompanhantes profissionais que compreendem o mundo dos negócios. Nossa experiência em Corporate Functions garante que cada evento seja executado com perfeição...',
  'Equipe Editorial',
  'Negócios',
  '/images/blog/corporate-events.jpg',
  'Guia completo para organizar eventos corporativos de luxo com acompanhamento profissional.',
  'eventos corporativos, acompanhamento executivo, luxo, negócios',
  ARRAY['Corporate event experience'],
  true,
  8
),
(
  'A Arte da Gastronomia: Experiências em Restaurantes Michelin',
  'arte-gastronomia-michelin',
  'Explore os melhores restaurantes Michelin de Londres com uma companheira que aprecia a alta gastronomia.',
  'A experiência gastronômica em restaurantes com estrelas Michelin vai além da comida - é sobre apreciar a arte culinária em sua forma mais refinada. Com conhecimento profundo sobre vinhos e etiqueta, proporcionamos...',
  'Equipe Editorial',
  'Gastronomia',
  '/images/blog/michelin-dining.jpg',
  'Descubra a experiência única de jantar em restaurantes Michelin com acompanhamento especializado.',
  'restaurantes michelin, gastronomia, vinhos, alta culinária',
  ARRAY['Michelin-starred restaurants', 'Wine knowledge'],
  true,
  6
),
(
  'Teatros de Londres: Uma Jornada Cultural Inesquecível',
  'teatros-londres-jornada-cultural',
  'Mergulhe na rica cena teatral londrina com uma companheira culta e apaixonada pelas artes.',
  'Londres oferece algumas das melhores produções teatrais do mundo. Desde o icônico West End até teatros boutique intimistas, cada espetáculo é uma oportunidade de vivenciar arte de classe mundial...',
  'Equipe Editorial',
  'Cultura',
  '/images/blog/london-theatre.jpg',
  'Explore a cena teatral de Londres com acompanhamento cultural especializado.',
  'teatro londres, west end, cultura, artes cênicas',
  ARRAY['Theatre knowledge', 'Event experience'],
  false,
  5
);