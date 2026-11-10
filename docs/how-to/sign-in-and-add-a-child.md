# Sign in with your email and add a child

For the parent on the Mac, comfortable with a terminal. Your account is your email address. It owns one profile for each child, and each profile is a game of its own with its own report, devices and PIN. Several children can sit under one email. The account has one budget for the model, which you set, and the profiles of other accounts never count against it.

No mail server is connected yet. The game "sends" the code to its own log, and `./meowtower code` prints it.

## Before you start

- The game runs: `./meowtower status` shows `meowtower: running`.
- You work in the project folder on the Mac, for the commands, and open the game's address in a browser, for the screen.

## Give the game you have played so far to your account (once)

1. Run the claim with your email and, if you like, the child's name in the game:

   ```sh
   ./meowtower claim you@example.org "Name"
   ```

   Only a person at the Mac can run it. The address is verified the first time you sign in.

## Sign in

1. Open the game's address and choose **Parent account** on the home screen.
2. Enter your email and press **Send a code**.
3. Print the code on the Mac:

   ```sh
   ./meowtower code
   ```

4. Enter the six digits and press **Sign in**. The code works for 10 minutes and once. Five wrong codes lock the address for 15 minutes.

## Add a child and pair her device

1. On the account screen, write the child's name in the game and press **Add**. The profile appears in the list.
2. Press **Code for a device** next to her name. The code works for 5 minutes.
3. On the child's tablet or computer, open the game's address, choose **Pair** and enter the code. The device now plays her profile and no other.

## Set the budget

The screen shows what the account spent this month and the limit. Write a new limit between 1 and 200 dollars and press **Save the budget**.

## Result

`./meowtower profiles` lists every account with its children:

```text
you@example.org | Name | p_1
```

## If it goes wrong

- `no_code`: nobody asked for a code yet. Press **Send a code** first.
- The screen says accounts work with Postgres: the game runs on the old file. Follow [Move the game to Postgres](move-the-game-to-postgres.md).
