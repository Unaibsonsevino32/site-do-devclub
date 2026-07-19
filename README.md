# DevClub — Escola de Programadores

Landing page institucional fictícia da **DevClub**, criada como projeto de
demonstração: uma escola de programação com formações do zero ao avançado,
comunidade, mentorias e plataforma de ensino própria.

Site estático (HTML/CSS/JS puro, sem build), tema escuro, com animações de
scroll (GSAP + ScrollTrigger) e um vídeo de abertura gerado por IA no hero.

## Destaques

- **Hero animado**: vídeo de um redemoinho de energia roxo/azul (gerado com
  Higgsfield) que, ao final, revela a logo do leão coroado da DevClub. O
  texto principal só aparece depois que a logo se dissolve, evitando
  sobreposição. Clicar em qualquer ponto do hero (ou no botão de replay no
  canto inferior direito) reinicia a animação.
- **Menu fixo** com logo, navegação e CTA "Quero ser aluno".
- **Empresas**: faixa com nomes fictícios de empresas em marquee infinito.
- **Formações**: carrossel horizontal *pinado* no scroll (15 formações —
  Front End, Back End, Full Stack, Mobile, React, Node, IA, N8N, Dados etc.)
  com destaque em azul e ícones com brilho animado.
- **Tecnologias, Benefícios, Plataforma de ensino** (mockup de dashboard
  100% em CSS), **Depoimentos**, **Professores**, **Módulo bônus**,
  **Certificação**, **Mercado de trabalho** (gráfico de salários animado),
  **Garantia de 7 dias**, **FAQ** (acordeão) e **Skills**.
- Todos os cards seguem a mesma linguagem visual: faixa gradiente
  azul→roxo no topo, glow no hover e ícones com pulso.

## Stack

- HTML5 + CSS3 (sem framework, variáveis CSS para o tema)
- JavaScript vanilla
- [GSAP](https://gsap.com/) + ScrollTrigger via CDN, para as animações de
  scroll, parallax e o carrossel pinado de formações
- Fontes: Sora (títulos) e Inter (texto), via Google Fonts

## Estrutura

```
.
├── index.html              # todas as seções da página
├── css/style.css           # tema, componentes e animações
├── js/main.js               # ScrollTrigger, sequência do hero, FAQ, contadores
├── assets/
│   ├── img/                # logo, fotos de professores e alunos (geradas)
│   └── video/               # vídeo de abertura do hero
└── scripts/                 # scripts Python usados na geração dos assets
    ├── optimize_images.py         # comprime/redimensiona as fotos geradas
    └── make_logo_transparent.py   # remove o fundo preto da logo (chroma key)
```

## Como rodar localmente

Não há build — basta servir os arquivos estáticos. Exemplo com Python:

```bash
python -m http.server 8080
```

Depois abra `http://localhost:8080` no navegador.

## Observações

- Empresas, depoimentos, professores e certificados são **fictícios**,
  criados apenas para preencher o layout de exemplo.
- As imagens de pessoas e o vídeo do hero foram gerados com IA
  (Higgsfield) e otimizados localmente antes de entrar no repositório.
