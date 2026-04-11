// javascript file -- with the help of others making this seperate file
document.addEventListener('DOMContentLoaded', function() {
    let equation = ''; // records the equation in a variable

    let b_num = document.querySelectorAll('.number'); // buttons for numbers
    for (let p = 0; p < b_num.length; p++) {
        b_num[p].addEventListener('click', function() {
            // if user pressed a number
            let num = b_num[p].value;
            // show the number on the equation screen
            document.querySelector('#equation').innerHTML += num; // store in an array
            equation += num;
        });
    }

    let b_extra = document.querySelectorAll('.extra'); // buttons for operators
    for (let q = 0; q < b_extra.length; q++) {
        b_extra[q].addEventListener('click', function() {
            // display operator on screen
            let signs = b_extra[q].value;
            if (signs == '+') {
                document.querySelector('#equation').innerHTML += signs; // store operator in the array
            } else if (signs == '-') {
                document.querySelector('#equation').innerHTML += signs; // store operator in the array, etc.
            } else if (signs == '*') {
                document.querySelector('#equation').innerHTML += signs;
            } else if (signs == '/') {
                document.querySelector('#equation').innerHTML += signs;
            }
            equation += signs;
        });
    }

    document.querySelector('.enter').addEventListener('click', function() {
        let error = 'no'; // to see if no errors
        let numbers = []; // stores numbers outside of the operators
        let ans = []; // answer
        let operators = []; // array for operators

        let num = []; // spare array for bedmas purposes
        let addsub = []; // spare array for bedmas purposes

        if (equation.length == 0) // if there is nothing in the equation
        {
            document.querySelector('#answer').innerHTML = 'Error';
            error = 'yes';
        } else {
            let i = 0;
            while (i < equation.length) // looping through the equation to extract NUMBERS
            {
                let value = '';
                // while there is not operators
                while (i < equation.length && equation[i] != '+' && equation[i] != '-' && equation[i] != '*' && equation[i] != '/') {
                    value += equation[i]; // combine digits to make a value
                    i++;
                }
                if (value !== '') //chatgpt and ddb gave me hint on this to look out for non-empty values
                {
                    numbers.push(parseInt(value)); // Got help and learned to use parseInt instead of int() in javascript
                    //learned the purpose of push() in an array
                }
                i++;
            }

            let j = 0;

            if (error === 'no') {
                while (j < equation.length) // go through equation to extract OPERATORS
                {
                    //while there is no numbers
                    if (equation[j] == '+' || equation[j] == '-' || equation[j] == '*' || equation[j] == '/') {
                        operators.push(equation[j]);
                        if (j < equation.length - 1 && (equation[j + 1] == '-' || equation[j + 1] == '*' || equation[j + 1] == '/')) // if consecutive operators
                        {
                            document.querySelector('#answer').innerHTML = 'Error'; // Error
                            error = 'yes';
                            break;
                        }
                        // if operator is the beginning of the equation
                        if (j == 0 && (equation[j] == '+' || equation[j] == '-' || equation[j] == '*' || equation[j] == '/')) {
                            document.querySelector('#answer').innerHTML = 'Error'; // error
                            error = 'yes';
                            break;
                        }
                    }
                    j++;
                }
            }

            //if operator is the end of the equation
            if (equation[equation.length - 1] == '+' || equation[equation.length - 1] == '-' || equation[equation.length - 1] == '*' || equation[equation.length - 1] == '/') {
                document.querySelector('#answer').innerHTML = 'Error'; // error; see previous comment
                error = 'yes';
            }

            num = [numbers[0]]; // new array is the first number
            // calculate (following bedmas)
            if (error === 'no') {
                // multiplication and division first
                for (let n = 0; n < operators.length; n++) {
                    if (operators[n] === '*') // ChatGPT gave me a hint on using *= and /=
                    {
                        // num[num.length -1] accesses the exact number of the array
                        num[num.length - 1] *= numbers[n + 1]; // multiply.
                    } else if (operators[n] === '/') {
                        if (numbers[n + 1] == '0') // error if user divides by 0
                        {
                            document.querySelector('#answer').innerHTML = 'Error';
                            error = 'yes';
                            break;
                        }
                        num[num.length - 1] /= numbers[n + 1]; // divide
                    } else {
                        num.push(numbers[n + 1]); // moves the unaffected numbers out of the way
                        addsub.push(operators[n]); // like mentioned above, chatgpt and internet taught me the push() feature
                    }
                }

                // addition and subtraction next AFTER multiplication & division
                ans = num[0]; // first number guaranteed to add or subtract now that multi/divi is over
                for (let x = 0; x < addsub.length; x++) {
                    if (addsub[x] === '+') // if addition
                    {
                        ans += num[x + 1];
                    } else if (addsub[x] === '-') // though the if statement isn't necessary, just in case
                    {
                        ans -= num[x + 1];
                    }
                }
            }

            if (error === 'no') {
                //DDB explains the rounding feature for javascript
                let result = Math.round(ans * 1000) / 1000;
                document.querySelector('#answer').innerHTML = result; // rounds to 3 decimal places
            } else {
                document.querySelector('#answer').innerHTML = 'Error';
            }
        }
    });

    // backspace
    let backspace = document.querySelector('#del');
    backspace.addEventListener('click', function() {
        let n = equation.length;
        if (n > 0) // if there is a value in the equation
        {
            let remove = '';
            for (let i = 0; i < (n - 1); i++) {
                remove += equation[i]; // remove recent value
            }
            equation = remove; // transfer new equation to original equation
            document.querySelector('#equation').innerHTML = equation; // print new out
        }
    });

    let ok = document.querySelector('#ok'); // bonus print out
    ok.addEventListener('click', function() {
        document.querySelector('#bonus').innerHTML = 'This just exists. Made in 2024 :)'
    });
});
// USED DDB to read over the code/syntax errors, as well as myself on my own.
// Independent work.