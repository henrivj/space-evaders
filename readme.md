# Visão geral do projeto

Space Evaders é um jogo 2D em JavaScript. O jogo roda em um loop controlado por `requestAnimationFrame`; a cada frame `Game.update()` trata o input, move as naves, atualiza as entidades, verifica colisões, troca de nível e checa vitória ou derrota.

![gameplay](https://raw.githubusercontent.com/henrivj/space-evaders/main/img/gameplay.png)

## Principais componentes

- **Spaceship** – nave do jogador (herda de `Entity`), tem vida, direção e método `update()` que a move verticalmente.
- **Asteroid** – obstáculo giratório que avança para a esquerda; pode reaparecer (`canRespawn`).
- **Star** – item colecionável que aumenta vida e pontuação, parecido com asteroide logicamente.
- **Entity** – classe base com posição, velocidade, tamanho, renderização e detecção de colisão.

## Estrutura de arquivos

- `index.html` – contém o `<canvas>` e importa `index.js`.
- `index.css` – estilo com fonte pixelada e tons de verde.
- `index.js` – cria o canvas, instancia `Game`, carrega níveis e captura teclado em `keysPressed`.
- `models/Game.js` – gerencia o ciclo de jogo, estados (`menu`, `playing`, `paused`, `victory`, `defeat`), pontuação e transição de níveis.
- `models/Renderer.js` – desenha fundo, entidades e HUD (barra de vida e barra de pontuação) usando **Canvas 2D**.
- `models/Cluster.js` – agrupa um tipo de entidade (`Asteroid` ou `Star`) e gera um conjunto com velocidade e tamanho aleatórios.
- `models/Level.js` – define objetivo de pontuação, velocidade da nave e clusters; controla o deslocamento do background na troca de nível.
- `models/entities/` – guarda todas as entidades que extendem `Entity`.
- `img/` – sprites e imagens de fundo.

## Sistemas internos

### Colisão

`Entity.collidesWith(other)` calcula a distância entre centros e compara com a soma dos raios.

### Spawn

`Cluster.generateEntities()` cria entidades fora da tela à direita e as espalha verticalmente. `drain()` desativa o respawn ao final do nível; `reset()` re-gera as entidades quando o nível recomeça.

### Entrada

`index.js` registra `keydown`/`keyup` em `keysPressed` (W, S, ArrowUp, ArrowDown, Enter). `Game.handlePlayerMovement()` lê esses flags e ajusta a direção das naves.

## Renderização

O jogo usa **Canvas 2D** (`context`). `Renderer.render()` limpa o canvas e faz a renderização através de:

- `renderGame()` – fundo, entidades e HUD.
- `renderScreen()` – telas de menu, pausa, vitória e derrota com textos centralizados.

HUD inclui barra de vida (cores variam conforme fração de vida) e barra de pontuação (preenchimento proporcional ao objetivo final).

## Pontuação

Em `Game.processLevel`:

- Colisão com `Star` concede +1000 pontos e cura a nave.
- Colisão com `Asteroid` reduz vida e adiciona pontos baseados no tamanho (`Math.trunc(entity.size)`).
- Quando o asteroide sai pela esquerda (`hasPassedX`), ele gera pontuação adicional antes de ser resetado ou eliminado, dependendo se o nível ainda está ativo.

## Fluxo de níveis

Ao completar o objetivo (`Level.isComplete`), `Game.handleLevelTransition()` drena o nível atual, avança para o próximo, ajusta `bgOffset` e a velocidade da nave. Quando não há mais níveis, o estado muda para `victory`.

O jogo roda em um loop simples controlado por `requestAnimationFrame()`. A cada frame o `Game.update()` trata input, move naves, atualiza entidades, verifica colisões, troca de nível e checa vitória/derrota. O tempo avança implicitamente; a velocidade dos objetos (`speed`) está em pixels por frame.

Os objetos principais são classes em `models/entities`:

- `Spaceship` (herda de `Entity`): representa a nave do jogador, tem `health`, `direction` e `update()` que o move verticalmente.
- `Asteroid` (herda de `Entity`): obstáculo que gira, avança em direção ao player e pode ser respawnado (`canRespawn`).
- `Star` (herda de `Entity`): coleta que aumenta vida e pontuação, quase igual ao asteroide.
- `Entity` fornece `posX`, `posY`, `size`, `speed`, `render()`, `collidesWith()` e `hasPassedX()`.

## Notas

- A lógica de pontuação está em `Game.processLevel`. Ao colidir, estrelas dão +1000 e aumentam vida; asteroides dão pontos (e dano) baseados no tamanho (`Math.trunc(entity.size)`).
- Ao passar da esquerda da tela (`hasPassedX`), asteroides que ainda estão vivos aumentam a pontuação e são resetados ou mortos dependendo se o nível está ativo.
- A transição de nível ajusta `bgOffset` e velocidade da nave; ao terminar o último nível o estado vira `victory`.
- O jogo provavelmente não é o mais performático (o mais difícil é manter os asteroides do nível anterior vivos até saírem da tela para não sumirem na frente do usuário — por isso todos os níveis anteriores são processados com `processLevel()`), mas não há risco de memory leak em sessões longas.
