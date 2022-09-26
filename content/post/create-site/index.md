---
title: How to make a website like this
subtitle: Learn how to deploy your Wowchemy website with GitHub Pages. Run Hugo on your machine to edit your website locally.

# Summary for listings and search engines
summary: Learn how to deploy your Wowchemy website with GitHub Pages. Run Hugo on your machine to edit your website locally.

# Link this post with a project
projects: []

# Date published
date: 2022-09-26

# Date updated
lastmod: 2022-09-26

# Is this an unpublished draft?
draft: false

# Show this page in the Featured widget?
featured: false

# Featured image
# Place an image named `featured.jpg/png` in this page's folder and customize its options here.
# image:
  # caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/CpkOjOcXdUY)'
  # focal_point: ''
  # placement: 1
  # preview_only: false

authors:
  - admin

# tags:
#   - Academic
#   - 开源

# categories:
#   - Demo
#   - 教程
---

This website was made by the [Wowchemy](https://wowchemy.com/) website builder using the Hugo [Academic Resumé Template](https://github.com/wowchemy/starter-hugo-academic). Wowchemy provides a simple guide for creating and deploying your website in [Netlify](https://www.netlify.com/). 

This website, however, is hosted on [GitHub Pages](https://pages.github.com/). While both services provide a free plan, GitHub Pages offers unlimited build minutes, unlike Netlify. I also prefer the default URL domain of GitHub Pages. 

In this post, I will describe step-by-step how you can do the same for your website. All you need is a GitHub account and you're all ready to go!

## Create the repository

Open the [Academic Theme repository](https://github.com/wowchemy/starter-hugo-academic) and click on the green button saying *Use this template*. You will be asked to create a new repository which you should name *username*.github.io, where *username* is your GitHub username. 

Alternatively, you can create a repository with same name and copy the contents of the Academic Theme to this new repository.

## Setup the repository

In ```config/_default/config.yml``` change the ```baseURL``` field to ```https://<username>.github.io``` and create a file named ```.github/workflows/gh-pages.yml``` with the following contents:
```
name: Deploy GitHub Pages

on:
  push:
    branches:
      - main  # Set a branch name to trigger deployment
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-22.04
    permissions:
      contents: write
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true  # Fetch any Git submodules (true OR recursive)
          fetch-depth: 0    # Fetch all history for .GitInfo and .Lastmod

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        # If you're changing the branch from main, 
        # also change the `main` in `refs/heads/main` 
        # below accordingly.
        if: ${{ github.ref == 'refs/heads/main' }}
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

For more details on this file, check out [GitHub Actions for Hugo](https://github.com/marketplace/actions/hugo-setup).

## Deploy your website

Go to your repository's *Settings*. On your left, under *Code and automation* go to *Pages*. Under *Build and deployment*, on *Branch* select ```gh-pages```. 

The ```gh-pages``` branch should've been created once you added the ```.github/workflows/gh-pages.yml``` file to GitHub. If it it's still not showing, just wait until it does and retry.

## Check your website

And that's it! It should take under a minute for your website to be successfully deployed. Visit your new website in **https://*username*.github.io**!

## Edit your website

Clone your repository and [install Hugo](https://gohugo.io/getting-started/installing/). Run your website on your machine by executing the command:

```
hugo server
```

This will provide you a link to access the website hosted on your machine. You can then modify your files and see the changes take place in real time. 

Wowchemy provides a useful [guide](https://wowchemy.com/docs/getting-started/get-started/) on how to manage your files. Visit their site to know more about all features they offer.

## Publish your modifications

Once you're done editting your website, push those changes to the ```main``` branch. GitHub will then deploy those changes and the updated website will be available in no time.