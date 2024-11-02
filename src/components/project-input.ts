import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { Validatable, validate } from "../util/validation";
import Component from "./base-component";

// ProjectInput class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElemet: HTMLInputElement;
  descriptionInputElemet: HTMLInputElement;
  peopleInputElemet: HTMLInputElement;
  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputElemet = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElemet = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElemet = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
  }
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElemet.value;
    const enteredDescription = this.descriptionInputElemet.value;
    const enteredPeople = this.peopleInputElemet.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input,  please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElemet.value = "";
    this.descriptionInputElemet.value = "";
    this.peopleInputElemet.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
}
