const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const User = require("../models/user");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("password hashes are not returned", async () => {
    const response = await api.get("/api/users");
    assert.strictEqual(response.body[0].passwordHash, undefined);
  });

  describe("addition of a new user", () => {
    test("a new user with valid data can be added", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "salainen",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      const usernames = usersAtEnd.map((user) => user.username);
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
      assert(usernames.includes(newUser.username));
    });

    test("cannot add new user without username", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        name: "Matti Luukkainen",
        password: "salainen",
      };

      await api.post("/api/users").send(newUser).expect(400);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("cannot add new user without password", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
      };

      await api.post("/api/users").send(newUser).expect(400);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("username must be at least 3 characters", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "ml",
        name: "Matti Luukkainen",
        password: "salainen",
      };

      await api.post("/api/users").send(newUser).expect(400);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("username must be unique", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "root",
        name: "Matti Luukkainen",
        password: "salainen",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(result.body.error.includes("expected `username` to be unique"));
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("password must be at least 3 characters", async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "sa",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert(
        result.body.error.includes("password must be at least 3 characters"),
      );
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(async () => await mongoose.connection.close());
