# Coding guidelines
1. Check for and remove unused variables and imports.
1. In general, address warnings as well as errors. When I run ionic serve, I get spammed with tons of warnings and that shouldn’t happen. Not every warning can be fixed, but there shouldn’t be pages and pages of them.
1. For services, please use the BaseService class.
1. Don’t include inline styles; put them in the CSS.
1. Let’s use SCSS as much as possible.
1. Scope your CSS to that specific component. Let’s not be bleeding all over the place.
1. Let’s not namespace styles or components. (i.e., nobo-header or NoboProductsService)
1. No fetch() calls outside of services.
1. Refrain from using any as much as possible. Let’s type everything so we know what we’re working with. I’m doing so with getting product details.
1. Only create components for things used on multiple pages. For example, on the notifications screen, there’s no need for a component per notification since it won’t be used anywhere else.
