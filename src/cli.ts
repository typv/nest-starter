#!/usr/bin/env node
import { CommandFactory } from 'nest-commander';
import { CommandModule } from './commands/command.module';

async function bootstrap() {
  await CommandFactory.run(CommandModule, ['warn', 'error']);
}
bootstrap();
