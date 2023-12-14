# General Information

Here is some general info to the next dev picking up the work on Dent247

## Concepts

- The site is a search engine for dentists
- Users should be able to come to the site and find:
  - Products
  - Companies
  - Articles
  - Courses
  - Deals (TBC)
- All of the above are basically linked from an organization e.g. An organization may have prouducts, a directory listing, blog articles and courses.
- Most of this interlinking is not done. So you can't yet go from a product to a company listing to the articles etc. But this is a feature we've talked about in future.

## Supabase

- Supabase is the DB and file storage.
- The schema is very ad hoc and changed significantly from when I picked it up to where I left it
- Members of the company have access to edit fields which has at times broken things. Restricting access to key fields would be a very good idea.
- Some of the tables have foreign keys that are text. This should be changed to use the row's id uuid instead. Sorry I ran out of time to do this.
- Ideally there would be a master categories table. We've ended up with separate categories for each feature but there's a lot of overlap (and some categories unique to that feature).
- There's a migration script to pull data out of supabase and upload it to Algolia...

## Aloglia

- Algolia is the search platform
- The data in Aloglia is uploaded via the migration script: https://github.com/dent247/algolia-supabase-import
  - The script is fine if rows are added or updated in supabase
  - It does not yet handle removing content from Aloglia if it's deleted in supabase.
  - To achieve this you will have to clear the Algolia index and then run the migration script to re-populate the index.
  - At the moment there isn't that much data so the script takes less than 10s (I think products is largest with ~3k rows)
- I'm assuming you know a bit about Algolia, if not you'll want to read up as the site uses it's React library a lot

## Webflow

- The old site was hosted on webflow
- I had to pull some data out of it and you can see the scripts I wrote for reference: https://github.com/dent247/webflow-supabase-migration
- I hope nothing else has to come out of it but you never know
