# Space Evaders

**Desenvolvedor:** Henrique Vieira Justus

![Logotipo/Banner](https://raw.githubusercontent.com/henrivj/space-evaders/main/public/img/gameplay.png)

---

## 1. Identificação do Projeto

*   **Título do Projeto:** Space Evaders
*   **Identificação do desenvolvedor:** Henrique Vieira Justus
*   **Logotipo/Banner:**
    ![Logotipo/Banner](https://raw.githubusercontent.com/henrivj/space-evaders/main/public/img/gameplay.png)

---

## 2. Visão Geral do Sistema

### Descrição
Space Evaders é um software de entretenimento do gênero game, desenvolvido em JavaScript puro, que utiliza a API Canvas para renderização 2D diretamente no navegador.

### Objetivo
A finalidade do game é proporcionar uma experiência de sobrevivência e reflexos, onde o jogador deve pilotar uma nave espacial através de campos de asteroides perigosos.

### Tema
O jogo possui o tema de **Corrida e Sobrevivência Espacial**. O objetivo principal é completar 3 fases distintas, evitando colisões fatais com obstáculos enquanto coleta recursos para pontuar e se manter vivo.

### Instruções de Jogabilidade
O jogo pode ser jogado por um ou dois jogadores simultâneos:

*   **Player 1:**
    *   `W`: Mover para cima
    *   `A`: Mover para esquerda
    *   `S`: Mover para baixo
    *   `D`: Mover para direita
*   **Player 2:**
    *   `Setas do teclado`: Movimentação em todas as direções

**Coletáveis e Obstáculos:**
*   **Estrela (⭐):** Colete para ganhar pontos.
*   **Asteroides (🌑):** Colidir com um asteroide reduz a vida da nave. Asteroides maiores causam mais dano.

### Especificações Técnicas
*   **Vidas:** Cada jogador inicia com 100 de vida.
*   **Pontuação:** Baseada na coleta de estrelas e na sobrevivência contra asteroides.
*   **Progressão:** O jogo possui 3 fases com dificuldade crescente (aumento na velocidade dos obstáculos e na densidade do campo de asteroides).
*   **Motor:** Baseado em `requestAnimationFrame` para garantir 60 FPS estáveis.

### Créditos
*   **Aluno:** Henrique Vieira Justus
*   **Product Owner (Professor Orientador):** Carlos Roberto da Silva Filho

### Link de Produção
O jogo está disponível para jogar online em: [https://space-evaders.vercel.app](https://space-evaders.vercel.app)

---

## 3. Instruções de Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

1.  **Clonagem:**
    ```bash
    git clone https://github.com/henrivj/space-evaders.git
    ```
2.  **Instalação de Dependências:**
    Certifique-se de ter o Node.js instalado. No diretório do projeto, execute:
    ```bash
    npm install
    ```
3.  **Execução do Projeto:**
    Para iniciar o servidor de desenvolvimento local (Vite):
    ```bash
    npm run dev
    ```
    O terminal informará o endereço local (geralmente `http://localhost:5173`) para abrir no navegador.

---

## 4. Link do Vercel
[Space Evaders em Produção](https://space-evaders.vercel.app)