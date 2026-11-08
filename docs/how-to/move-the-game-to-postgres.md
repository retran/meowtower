# Move the game from its old file to Postgres

For the parent on the Mac, comfortable with a terminal. The game keeps all its data in Postgres, a database that runs beside the game on your Mac and nowhere else. Games played before that change sit in a file in the game's volume. `./meowtower move` copies that file's log into Postgres once, rebuilds every derived table, checks the copy against the file, and leaves the file where it is.

## Before you start

- Docker runs, and you work in the project folder on the Mac.
- You have rebuilt the images after updating: `docker compose build`.
- The old file exists. On a new Mac with no play yet there is nothing to move, and you skip this page.

## Steps

1. Run the move. It stops the game while it copies, and starts it again after:

   ```sh
   ./meowtower move
   ```

## Result

The command prints how many events it moved and how many rows of each table it carried:

```text
moved 1946 events and 8 derived tables from /var/lib/meowtower/meowtower.sqlite into p_1
  devices: 6 rows
  parent_pin: 1 rows
```

If the copy differs from the file at any point, the command stops with `move_refused` and a reason, and the game keeps the data it had. A profile that already holds events is not touched: the command refuses, so running it twice does no harm.

## Where the old file goes

Nothing deletes it. After a week of play on Postgres you can remove the volume `meowtower-db`. Backups from then on are files in `data/snapshots/` that any program on the Mac can read, and `./meowtower restore` loads the newest one back into Postgres.
