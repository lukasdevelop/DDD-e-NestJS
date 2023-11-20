import { RegisterStudentUseCase } from "./register-student";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";

let inMemoryStudentsRepo: InMemoryStudentsRepository;
let  fakeHasher: FakeHasher

let sut: RegisterStudentUseCase;

describe("Register Student", () => {
    beforeEach(() => {
        inMemoryStudentsRepo = new InMemoryStudentsRepository()

        fakeHasher = new FakeHasher()

        sut = new RegisterStudentUseCase(inMemoryStudentsRepo, fakeHasher)
    });

    it("should be to able a new student", async () => {
        const result = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            student: inMemoryStudentsRepo.items[0]
        })
    });

    it("should hash student password upon registration", async () => {
        const result = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const hashedPassword = await fakeHasher.hash('123456')

        expect(result.isRight()).toBe(true)
        expect(inMemoryStudentsRepo.items[0].password).toEqual(hashedPassword)
    });
});
