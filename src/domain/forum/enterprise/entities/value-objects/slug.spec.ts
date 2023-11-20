import { Slug } from "./slug";

test("it should be able to create a new slug from text", () => {
    const slug = Slug.createFromText("Exemplo titulo questão");

    expect(slug.value).toEqual("exemplo-titulo-questao");
});
