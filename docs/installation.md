---
title: Installation
nav_order: 2
---

# Installation
{: .no_toc }

## Table of Contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Install

First, install the NPM module

```bash
npm i @liquidlight/vite-framework
```

**Note:** Depending on your local `npm` set up (if you have `save=false` in your `.npmrc` file), you may need `npm i @liquidlight/vite-framework --save -D` instead

## Create configuration

Create a `vite.config.ts` for your vite configuration and include the `configuration` function from the framework

```ts
import { defineConfig, configuration } from '@liquidlight/vite-framework';

export default defineConfig(
	configuration()
);
```
