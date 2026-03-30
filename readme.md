Perfeito! Aqui está o README atualizado em **Markdown (.md)** pronto para usar:

```markdown
# Space Evaders

![gameplay](https://raw.githubusercontent.com/henrivj/space-evaders/main/public/img/gameplay.png)

- **Desenvolvedor:** Henrique Vieira Justus

---

## 2. Visão Geral do Sistema

### Descrição

Space Evaders é um jogo 2D em JavaScript que roda diretamente no navegador usando a API Canvas. O jogador controla naves espaciais e deve sobreviver a obstáculos enquanto coleta itens para aumentar a pontuação.

### Objetivo

O objetivo do jogo é completar 3 fases consecutivas, evitando colisões com asteroides e coletando estrelas para aumentar a pontuação e recuperar vida, até alcançar a vitória final.

### Tema

Corrida espacial: os jogadores pilotam naves evitando obstáculos e coletando estrelas, enfrentando dificuldade crescente e cenários diferentes a cada fase.

### Instruções de Jogabilidade

- **Movimento do jogador:**
  - Player 1: `W` (cima), `S` (baixo)
  - Player 2: `ArrowUp` (cima), `ArrowDown` (baixo)
- **Coletáveis:**
  - **Estrela**: aumenta vida e concede +1000 pontos
- **Obstáculos:**
  - **Asteroide**: reduz a vida da nave ao colidir, gera pontuação baseada no tamanho

### Especificações Técnicas

- **Sistema de pontuação:** Colisão com estrelas (+1000), asteroides dão pontos de acordo com o tamanho
- **Sistema de vidas:** Cada nave começa com 3 vidas; colisões com asteroides reduzem 1 vida
- **Progressão de fases:** 3 fases, aumento de velocidade e quantidade de obstáculos, fundos diferentes
- **Loop de jogo:** Controlado via `requestAnimationFrame()` garantindo 60 FPS
- **Tela de HUD:** Mostra barra de vida e barra de pontuação proporcional à meta da fase

### Regras de Negócio

1. **Dificuldade Progressiva (RN01):** A cada fase, a velocidade e quantidade de inimigos aumentam
2. **Troca de Cenário (RN02):** Cada fase possui fundo diferente para indicar evolução
3. **Vitória (RN03):** O jogador vence apenas ao completar a terceira fase com pelo menos 1 vida
4. **Manual de Instruções (RN04):** Tela explicando teclas de comando, sistema de pontuação e coletáveis

### Telas do jogo

- Menu Inicial
- Tela de Jogo
- Tela de Pausa
- Tela de Vitória
- Tela de Derrota
- Tela "Sobre" com dados do desenvolvedor e do orientador

---

## 3. Requisitos Funcionais

| Código | Requisito                                                    |
| ------ | ------------------------------------------------------------ |
| RF01   | Movimentação vertical das naves                              |
| RF02   | Sistema de vidas para cada jogador                           |
| RF03   | Sistema de pontuação baseado em colisões e obstáculos        |
| RF04   | Itens colecionáveis que aumentam pontuação e vida            |
| RF05   | Progressão automática de 3 fases com dificuldade crescente   |
| RF06   | Interface com telas de menu, jogo, vitória/derrota e "Sobre" |

---

## 4. Requisitos Não Funcionais

| Código | Requisito                                          |
| ------ | -------------------------------------------------- |
| RNF01  | Desenvolvido em JavaScript puro (ES6+)             |
| RNF02  | Portável, roda diretamente em navegadores modernos |
| RNF03  | Interface projetada para resolução de 1920x1080 px |
| RNF04  | Desempenho consistente com 60 FPS usando Canvas 2D |

---

## 5. Estrutura de Arquivos
```

/public
/img
/levels
level_1.png
level_2.png
level_3.png
spaceship0.png
spaceship1.png
asteroid.png
star.png
index.html
index.css
index.js
/models
Game.js
Renderer.js
Level.js
Cluster.js
/entities
Entity.js
Spaceship.js
Asteroid.js
Star.js
README.md

````

---

## 6. Instruções de Instalação e Execução

1. **Clonagem do repositório:**
```bash
git clone https://github.com/henrivj/space-evaders.git
````

2. **Instalação de dependências:**

```bash
npm install
```

3. **Execução do projeto:**

- Abra `index.html` no navegador **ou** rode um servidor local, ex:

```bash
npx serve .
```

4. **Link de produção:**
   [Space Evaders Online](https://vercel-link-do-jogo)

---

## 7. Créditos

- Desenvolvedor: Henrique VJ
- Orientador: [Nome do Professor]
- Sprites e assets: Criados pelo desenvolvedor ou obtidos de fontes livres

```

```
