import chalk from 'chalk';
import { Question, QuestionSet } from 'nest-commander';
import Validator from 'validatorjs';
import { questionConstants } from '../command.constant';

@QuestionSet({ name: questionConstants.createAdmin })
export class CreateAdminQuestions {
  /*  @Question({
    type: 'list',
    message: 'Create a master admin? (No: Create an user of admin page.)',
    name: 'isMasterAdmin',
    choices: [
      'Yes',
      'No',
    ]
  })
  parseIsMasterAdmin(isMasterAdmin: string): boolean {
    return isMasterAdmin === 'Yes';
  }*/

  @Question({
    type: 'input',
    message: 'Please enter your email:',
    name: 'email',
    validate: async function (email: string) {
      let rules = {
        email: 'required|string|email',
      };
      let validation = new Validator({ email: email }, rules);
      if (validation.fails()) {
        const firstErrors = validation.errors.first('email');
        console.log(chalk.red(`${firstErrors}`));

        return false;
      }

      return true;
    },
  })
  parseEmail(email: string) {
    return email;
  }

  @Question({
    type: 'password',
    message: 'Please enter your password:',
    name: 'password',
    validate: function (password: string) {
      Validator.register(
        'checkPassword',
        function (value) {
          return value.match(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z]).*$/);
        },
        'Password too weak.',
      );
      let rules = {
        password: 'required|string|min:8|max:64|checkPassword',
      };

      let validation = new Validator({ password: password }, rules);
      if (validation.fails()) {
        const firstErrors = validation.errors.first('password');
        console.log(chalk.red(`${firstErrors}`));
        return false;
      }

      return true;
    },
  })
  parsePw(password: string) {
    return password;
  }
}
