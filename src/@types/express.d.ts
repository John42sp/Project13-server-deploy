//req.userId -> userId não encontrado no express, fazer tipo customizado do userId - refer. checkJwt.ts
//não subscrevendo a Request do Express, apenas fazendo um merge, adicionando. 
//

declare namespace Express {
    export interface Request {
        user_id: number; 
    }
}


