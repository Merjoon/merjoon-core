# Merjoon

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

What you need to install to run the project:

- **Node.js** (version 20.x or higher) — download from [official website](https://nodejs.org/)

Make sure that the installed versions meet these requirements. You can check your installed versions by running:

```bash
   node -v
   ```
### Installation

1. Clone the repository:

    ```bash
    git clone git@github.com:Merjoon/merjoon-core.git
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Usage

1. Run Tests:
   >Make sure you have the necessary `.test.env` file with required environment variables in the root directory of the project.
   >>you can copy it from .env.example file
```bash      
  cp .env.example .test.env 
```
```bash
 npm run test
```
or

```bash
  npm run test:coverage
```

2. This is how to verify:
   >Make sure you have the necessary `.env` file with required environment variables in the root directory of the project.
    >>you can copy it from .env.example file
```bash      
  cp .env.example .env 
```
```bash
  npm run verify:<integration>
```
After this in folder .transformed you will see folder with your integration and verified information in it.


## Adding a New Integration
To add a new integration (e.g., YourNewIntegration), follow these steps:

1. Create a Service File:

   Navigate to the verify/services directory.
   Create a new file named yourNewIntegration.ts;
   export const service = getYourNewIntegrationService();

2. Update IntegrationId Enum:

   Open the verify/types.ts file.
   Add your new integration to the IntegrationId enum:

   export enum IntegrationId {
   <Integration> = <integration>,
   }

3. Update package.json:

   > Open the project.json file in the root directory of the project.

   > in the scripts section of package.json add
```json
  {
   ...
   "scripts": {
      ...
      "verify:<integration>": "ts-node src/verify <integration>"
      ...},
   ...}
}
```