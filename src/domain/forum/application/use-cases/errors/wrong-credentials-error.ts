import { UseCaseError } from "@/core/errors/use-case-errors";

export class WrongCredentialError extends Error implements UseCaseError {
    constructor(){
        super(`Credential are not valid.`)
    }
}