import { Suspense } from "react";
import usePromise from "react-promise-suspense";
import { doctype, render } from "./custom-render";

describe("render()", () => {
  it("works with `style` and a `className`", async () => {
    const EmailComponent = (props: { username: string }) => {
      return (
        <div
          className="this-is-my-class-name"
          style={{ transitionTimingFunction: "ease" }}
        >
          Hello, {props.username}
        </div>
      );
    };
    const html = await render(<EmailComponent username="banana man" />);

    expect(html).toMatchSnapshot();
  });

  it("works with Suspense", async () => {
    const wait = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    };

    const EmailComponent = (props: { username: string }) => {
      const username = usePromise(
        async (value) => {
          await wait();
          return value;
        },
        [props.username],
      );

      return (
        <div
          className="this-is-my-class-name"
          style={{ transitionTimingFunction: "ease" }}
        >
          Hello, {username}
        </div>
      );
    };

    const html = await render(
      <div>
        <Suspense>
          <EmailComponent username="banana woman" />
        </Suspense>
      </div>,
    );

    expect(html).toMatchSnapshot();
  });

  it.only("should not modify double curlybraces", async () => {
    const element = <>{'{{my_variable}}'}</>;
    const html = await render(
      element
    );
    expect(html).toBe(`${doctype}{{my_variable}}`);
  });
  //test("with a demo email template vs react-dom's SSR", async () => {
  //  const template = <VercelInviteUserEmail />;
  //  const html = await render(template, { pretty: false });
  //  const htmlFromReactDom = await renderAsync(template, { pretty: false });
  //  expect(html).toBe(
  //    htmlFromReactDom
  //      .replaceAll(/<!--.*?-->/g, (match) =>
  //        match.startsWith("<!--[if mso]>") ? match : "",
  //      ) // ignore comments from React DOM's suspense and other things support
  //      .replaceAll("&#x27;", "'") // ignore HTML entities React DOM might use
  //      .replaceAll("&quot;", '"'),
  //  );
  //});
});
