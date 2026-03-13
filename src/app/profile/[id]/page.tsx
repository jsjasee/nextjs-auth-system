export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // declare the type, which is 'any' - captures everything.
  // params is a promise, so we need to await it. (only for next.js)
  const userParams = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">Profile page: </p>
      <span className="text-4xl bg-amber-500 rounded-xl px-2">
        {userParams.id}
      </span>
    </div>
  );
}

// how do we fetch the route like /profile/123 _>
// just create a folder with the name [] (IN the profile folder) then in the sq brackets just put in the name of the data, eg [id], then dump this page.tsx file in that folder.
