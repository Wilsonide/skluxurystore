import Container from "@/components/shared/container";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold">Bookstore</h3>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Discover amazing books from top authors around the world.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Explore</h4>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>Books</p>

              <p>Authors</p>

              <p>Categories</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Company</h4>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>About</p>

              <p>Contact</p>

              <p>Privacy</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Newsletter</h4>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Get updates about new books and offers.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
