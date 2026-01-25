import { useActionState, use } from "react";

import { OpinionsContext } from "../store/opinions-context";

function isValid(value, min, max) {
  const trimmed = value.trim();
  return trimmed.length >= min && trimmed.length <= max;
}

export function NewOpinion() {
  const { addOpinion } = use(OpinionsContext);

  async function opinionAction(prev, formData) {
    // it will also give us the previous value, we should add it while we dont need it, but have to add it
    const name = formData.get("userName"); // use .get("username") = like that...
    const title = formData.get("title");
    const opinion = formData.get("body");

    let errorsArr = [];

    if (!isValid(name, 5, 45)) {
      errorsArr.push("Enter a name between 5-45 characters");
    }

    if (!isValid(title, 5, 45)) {
      errorsArr.push("Enter a title between 5-45 characters");
    }

    if (!isValid(opinion, 10, 300)) {
      errorsArr.push("Enter a opinion between 10-300 characters");
    }

    if (errorsArr.length > 0) {
      return {
        errorsArr,
        enteredValues: {
          name,
          title,
          opinion,
        },
      }; // must retrun a object
    }

    await addOpinion({
      title,
      body: opinion,
      userName: name,
    });
    return { errorsArr: null }; // must retrun a object
  }

  // bottom of the forFunc bcz state need that func.
  // but waaait a minnn, why do we need that state, to get return value from the usaActionFunction

  const [formState, formAction, pending] = useActionState(opinionAction, {
    errorsArr: null,
  });

  // we also can useFormStatus() from react-dom in place of [..., ..., pending] to enhance reusability of component submit buttton

  return (
    <div id="new-opinion">
      <h2>Share your opinion!</h2>
      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="userName">Your Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              defaultValue={formState.enteredValues?.name}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={formState.enteredValues?.title}
            />
          </p>
        </div>
        <p className="control">
          <label htmlFor="body">Your Opinion</label>
          <textarea
            id="body"
            name="body"
            defaultValue={formState.enteredValues?.opinion}
            rows={5}
          ></textarea>
        </p>

        {formState.errorsArr && (
          <ul className="errors">
            {formState.errorsArr.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <p className="actions">
          <button type="submit" disabled={pending}>
            {!pending ? "Submit" : "Sending..."}
          </button>
        </p>
      </form>
    </div>
  );
}
