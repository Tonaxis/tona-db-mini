<div align="center">
<a href="https://github.com/tonaxis/tona-db-mini">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Tonaxis/tona-db-mini/main/docs/images/tona_db_mini_logo_dark.svg" alt="Logo of Tona DB mini" width="450px">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Tonaxis/tona-db-mini/main/docs/images/tona_db_mini_logo_light.svg" alt="Logo of Tona DB mini" width="450px">
  <img alt="Logo of Tona DB mini" width="450px" src="https://raw.githubusercontent.com/Tonaxis/tona-db-mini/main/docs/images/tona_db_mini_logo_light.svg">
</picture>
</a>

**A simple library to store and retrieve JSON data**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/tonaxis/tona-db-mini)](https://github.com/tonaxis/tona-db-mini/releases)
![](https://img.shields.io/badge/Typescript-5.8.3-3178C6?style=flat-circle&logo=typescript&logoColor=3178C6)
</div>


## Summary
- [Explanation](#explanation)
- [Configuration](#configuration)
- [Installation](#installation)
- [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Add data to collection](#add-data-to-collection)
    - [Get data from collection](#get-data-from-collection)
    - [Update data in collection](#update-data-in-collection)
    - [Delete data from collection](#delete-data-from-collection)
    - [Filters](#filters)



## Explanation
**Tona DB mini** is a Node module written in TypeScript that provides the ability to store, update, and retrieve data persistently, much like a database would. It is designed to be simple to use and quick to set up, making it easy to integrate into a small project that requires data persistence without the need to implement a traditional and complex database.
Data is stored in JSON format, which makes it easy to manipulate and migrate between projects. The module simulates a non-relational database with a system of **collections**.
> Note: This project still under development. Many features are planned for future releases.

## Installation
Simply run the following command to install the module from npm:

```shell
npm install tona-db-mini
```

## Configuration
To configure the module, you can create a configuration file named `tdb-mini.config.json` in the root directory of your project. This file should contain the following properties:

```json
{
  "dbPath": "./tdb-mini-data",
  "prettyJson": false
}
```

- `dbPath` - The path to the database folder.
- `prettyJson` - A boolean value that determines whether the JSON data should be formatted with indentation.

## Usages

### Basic Usage
```ts
import db from "tona-db-mini";

// Create your type for your collection
type User = {
  name: string;
  age: number;
};

const users = db.collection<User>("users");

// Add a new user
users.add({ name: "John Doe", age: 30 });

// Get user by name
const user = users.get({ name: "John Doe" });
```

### Add data to collection
To add data to a collection, you can use the `add` method.
The `add` method takes an object or an array of objects as an argument.

```ts
import db from "tona-db-mini";

// Create your type for your collection
type User = {
  name: string;
  age: number;
};

const users = db.collection<User>("users");

// Add a new user
users.add({ name: "John Doe", age: 30 });

// Add multiple users
users.add([{ name: "Jane Doe", age: 25 }, { name: "Bob Smith", age: 35 }]);
```

### Get data from collection
To get data from a collection, you can use the `get` method.
The `get` method takes an [Filter](#filters) as an argument. If no filter is provided, it will return all data from the collection.

```ts
import db from "tona-db-mini";

// Create your type for your collection
type User = {
  name: string;
  age: number;
};

const users = db.collection<User>("users");

// Get data from collection
const specificUser = users.get({ name: "John Doe" });

// Get all data from collection
const allUsers = users.get();
```

### Update data in collection
To update data in a collection, you can use the `update` method.
The `update` method takes a [Filter](#filters) and a partial data object as arguments.

```ts
import db from "tona-db-mini";

// Create your type for your collection
type User = {
  name: string;
  age: number;
};

const users = db.collection<User>("users");

// Update data in collection
users.update({ name: "John Doe" }, { age: 31 });
```


### Delete data from collection
To delete data from a collection, you can use the `del` method.
The `del` method takes an [Filter](#filters) as an argument. If no filter is provided, it will delete all data from the collection.

```ts
import db from "tona-db-mini";

// Create your type for your collection
type User = {
  name: string;
  age: number;
};

const users = db.collection<User>("users");

// Delete data from collection
users.del({ name: "John Doe" });

// Delete all data from collection
users.del();
```

### Filters
You can use a filter to specify which data you want to **get**, **update**, or **delete** from a collection. The filter can be an object or a predicate function.

```ts
import db from "tona-db-mini";

// Create your type for your collection
type User = {
  name: string;
  age: number;
};

const users = db.collection<User>("users");

// Get user with name "John Doe"
const specificUser = users.get({ name: "John Doe" });

// Get users with age greater than 30
const olderUsers = users.get((user) => user.age > 30);
```

### Usage in JavaScript
**Tona DB Mini** can also be used in JavaScript. Just add ``.default`` to the result of ``require("tona-db-mini")`` to access the default export.

```js
const db = require("tona-db-mini").default;

const users = db.collection("users");

// Add a new user
users.add({ name: "John Doe", age: 30 });

// Get user by name
const user = users.get({ name: "John Doe" });
```
