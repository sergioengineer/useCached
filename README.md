this project is an example on how to use Typescript in order to infer types while creating services which interface with external libraries.

After the user defines the ApiService with the methods which, in turn, call apis.
Then the user is able to call a custom hook which interfaces with reactQuery using the parameters of the method
as cache keys and with an additional Options parameter:

const {data, isLoading, isError, isFetching} = useCached("name_of_the_method", parameters_of_the_method,optional_options_parameter)

An example is provided inside the index.ts file.
