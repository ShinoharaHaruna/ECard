# E Card Game

A card game from *Kaiji*, built with React and TypeScript, featuring a unique betting system and strategic gameplay.

<div align="center">
    <img src="https://static.wikia.nocookie.net/vsbattles/images/2/2b/Kaijiproperrender.png/revision/latest?cb=20180520034603" alt="Ito Kaiji" />
</div>

## Game Rules

### Cards
- **Emperor (E)**: Beats Citizen (C)
- **Citizen (C)**: Beats Slave (S)
- **Slave (S)**: Beats Emperor (E)

### Winning Conditions
- Standard Win: Winning player gets ￥100,000 times the bet
- Special Win: If Slave beats Emperor, winning player gets ￥500,000 times the bet
- Draw: When both players play the same card type, the round continues with remaining cards

### Gameplay
1. Start with 30 chips
2. Place your bet (1 to all chips)
3. Select a card to play
4. Computer selects its card
5. Winner is determined based on card hierarchy
6. Game continues for 5 rounds or until a player runs out of chips

## Features

- 🌐 Multilingual Support (English, 中文, 日本語)
- 💰 Dynamic Betting System
- 🎮 Strategic Card Selection
- 🎯 Special Win Conditions
- 🔄 Automatic Game State Management
- 📱 Responsive Design

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui Components

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/ShinoharaHaruna/ECard.git
   cd Ecard
   ```

2. Install dependencies
   ```bash
   npm install
   # or yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or yarn dev
   ```

4. Open the browser and navigate to `http://localhost:5173`, and start playing!

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_DEBUG_MODE=false  # Set to true to reveal computer's cards
```

## Development

Project Structure:

```bash
src/
  ├── components/     # React components
  ├── i18n/          # Translations
  ├── lib/           # Game logic and utilities
  ├── types/         # TypeScript type definitions
  └── App.tsx        # Main application component
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

This project **DOES NOT** hold any copyright for all content involving *Kaiji*.