# deploy.stitch.tech

Stitch makes deploying services to customer clouds easier.

This repo is for [deploy.stitch.tech](https://deploy.stitch.tech/) which is the page customers open to deploy a service to their cloud.

[You can find the Stitch backend here, which is required for some features in this repo to work.](https://github.com/stitchtechnologies/stitch-deploy-server)


## ⚙️ Setup

1. Clone this repo from GitHub
2. Run `yarn` to install all dependencies
3. Populate the root `.env` file with the following environment variables:

```
NEXT_PUBLIC_SERVER_HOST="api.stitch.tech url. link to this repo above"
NEXT_PUBLIC_POSTHOG_KEY="posthog key"
NEXT_PUBLIC_POSTHOG_HOST="posthog url"
DATABASE_URL="postgres db url"
```
4. Run `yarn dev` to start the service locally in development mode.
5. Run `yarn build` and then `yarn start` to start in production mode.

## Contributing

Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue. Don't forget to give the project a star!

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## Contact

[Join our Slack!](https://join.slack.com/t/stitchsupport/shared_invite/zt-2d839m41h-qYy7ZTJ1mRec7zYw4Pl9oQ)