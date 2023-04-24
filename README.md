# DnD NPC Generator

This is a simple web application that generates randomized NPC (Non-Player Character) names and descriptions for Dungeons and Dragons (DnD) games.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this project, you will need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installing

1. Clone the repository to your local machine using Git:
```git clone https://github.com/yourusername/DnD-NPC-Generator.git```

2. Navigate to the project directory and install the dependencies using npm:

```
cd DnD-NPC-Generator
npm install
```

3. Create a `.env` file in the root of your project directory and add the following environment variable:

```REACT_APP_OPENAI_API_KEY=your_openai_api_key_here```

4. Run the project using the `start` script:

```npm start```


The project should now be running on `http://localhost:3000/`.

## Built With

* [React](https://reactjs.org/) - A JavaScript library for building user interfaces
* [Create React App](https://create-react-app.dev/) - A tool for creating React apps with no build configuration
* [OpenAI API](https://beta.openai.com/docs/api-reference/introduction) - An artificial intelligence platform that provides APIs for natural language processing tasks

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

* The NPC names and descriptions are generated using the OpenAI API.
* This project was inspired by [NPC Generator](https://donjon.bin.sh/fantasy/random/#type=npc), a web application for generating randomized NPCs.
