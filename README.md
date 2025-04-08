# Merjoon

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

What you need to install to run the project:

- **Node.js** (version 21.x or higher) — download from [official website](https://nodejs.org/)
- **npm** (version 10.x or higher) — will be installed automatically with Node.js

Make sure that the installed versions meet these requirements. You can check your installed versions by running:

1. ```bash
   node -v
   ```
2. ```bash
   npm -v
   ```
### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Merjoon/merjoon-core.git
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Usage

This is how to run the project.

1. Make sure you have the necessary `.env` and `.test.env` files with required environment variables in the root directory of the project.
   > you can copy it from .env.test.example file
   ```bash
    cp .env.test.example .env
    cp .env.test.example .test.env
    ```

2. Run the project:
    ```bash
    npm run-script <script-name>
    ```
   For verifying you need to write for example:
   ```bash
    verify:<script-name>
    ```
3. If you need to add any dependencies, settings, or other parameters to the project, you must edit the project.json file in the root directory.
   > 1․Open the project.json file in the root directory of the project.

   > 2․ Add the necessary dependencies or configuration:
   - **To add a new dependency, include it in the "dependencies" section:**
   - **To add configuration settings, include them in the appropriate section:**