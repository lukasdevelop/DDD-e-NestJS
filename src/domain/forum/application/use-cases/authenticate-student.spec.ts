import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { MakeStudent } from "test/factories/make-student";

let inMemoryStudentsRepo: InMemoryStudentsRepository;
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
    beforeEach(() => {
        inMemoryStudentsRepo = new InMemoryStudentsRepository()
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()

        sut = new AuthenticateStudentUseCase(inMemoryStudentsRepo, fakeHasher, fakeEncrypter)
    });

    it("should be able to authenticate a student", async () => {
        const student = MakeStudent({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456')
        })

        inMemoryStudentsRepo.items.push(student)
        
        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(result.isRight()).toBe(true)

        expect(result.value).toEqual({
            accessToken: expect.any(String)
        })
    });
});
