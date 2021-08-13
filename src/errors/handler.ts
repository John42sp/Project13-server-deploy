import { ErrorRequestHandler } from 'express';
//fazer tratativa pra ver se é erro de validação no handler:
import { ValidationError } from 'yup';

interface ValidationErrors{
    [Key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {

    if (error instanceof ValidationError) {  //primeiro ver se é erro de validação(Yuo)
        let errors: ValidationErrors = {};

        error.inner.forEach(err => {
            errors[err.path] = err.errors;
        })
        return response.status(400).json({ message: 'Validation fails', errors })
    }

    console.error(error)

    return response.status(500).json({ message: 'Internal server error'});
}

export default errorHandler;  

//para o cliente q estiver consumindo a api não saber exatamente qual erro ocorreu, apenas receber uma menssagem padrao.