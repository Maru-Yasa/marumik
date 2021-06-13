const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const manga = require("./routers/manga");
const chapter = require("./routers/chapter");
const cors = require("cors");
const helmet = require("helmet");
const indexRoute = require('./routers/indexRoute')

app.use(express.urlencoded({ extended: true }))
app.set('view engine','ejs')
app.use(cors());
app.use(helmet());
// app.use("/api", manga);
app.use(express.static("./public"));
// app.use("/api/chapter", chapter);
app.use('/',indexRoute)
// app.use("/api", (req, res) => {
//   res.send({
//     status: true,
//     message:
//       "For more info, check out https://github.com/febryardiansyah/manga-api",
//     find_me_on: {
//       facebook: "https://www.facebook.com/febry.ardiansyah.792/",
//       instagram: "https://instagram.com/febry_ardiansyah24",
//       github: "https://github.com/febryardiansyah/manga-api",
//     },
//   });
// });
app.use("*", (req, res) => {
  res.status(404).render('404')
});




app.listen(PORT, () => {
  console.log("Listening on PORT:" + PORT);
});
