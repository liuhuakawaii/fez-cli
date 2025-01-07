#!/usr/bin/env node
import { Command } from 'commander';
import create from '../src/core/create.js';
import chalk from 'chalk';

const program = new Command();

program
  .version('1.0.0')
  .command('create <project-name>')
  .description('create a new project')
  .action((name) => {
    create(name);
  });

program.parse(process.argv);